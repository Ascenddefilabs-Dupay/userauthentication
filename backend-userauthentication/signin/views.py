from datetime import datetime, timedelta, timezone
import json
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
import urllib3
from signup.models import CustomUser
from .serializers import LoginSerializer
from django.core.mail import send_mail
from django.conf import settings
from django.core.cache import cache
from django.views.decorators.csrf import csrf_exempt
import logging
from django.utils.crypto import get_random_string
from rest_framework.decorators import api_view
from django.contrib.auth.hashers import check_password
from django.contrib.auth.hashers import make_password
from django.contrib.auth import login as auth_login
import jwt
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import FiatWallet

SECRET_KEY = 'YOUR_SECRET_KEY'

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            password = request.data.get('user_password')

            # Check if the provided password matches the stored hash
            if not check_password(password, user.user_password):
                return Response({"detail": "Incorrect email or password"}, status=status.HTTP_400_BAD_REQUEST)

            # Check registration status
            if not user.registration_status:
                return Response({"detail": "User is not fully registered"}, status=status.HTTP_400_BAD_REQUEST)

            # Update user_status to True upon successful login
            user.user_status = True
            user.save()

            # Generate session ID
            session_id = get_random_string(length=32)
            expiration_time = datetime.now(timezone.utc) + timedelta(days=30)  # Use timezone-aware datetime

            # Save session data in the database
            user.session_id = session_id
            user.session_expiration = expiration_time
            user.save()

            # Send OTP or perform other actions as needed
            otp = get_random_string(length=6, allowed_chars='0123456789')
            cache.set(f"otp_{user.user_email}", otp, timeout=300)  # Store OTP in cache for 5 minutes

            send_mail(
                "Your OTP Code",
                f"Your OTP code is {otp}",
                settings.DEFAULT_FROM_EMAIL,
                [user.user_email],
                fail_silently=False
            )

            return Response({
                "user_id": user.user_id,  # Adjusted to the correct primary key
                "user_email": user.user_email,
                "user_status": user.user_status,  # Include user_status
                "registration_status": user.registration_status  # Include registration status
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GenerateOTP(APIView):
    def post(self, request):
        email = request.data.get('user_email')

        if not email:
            return Response({"message": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch user from CustomUser
        try:
            user = CustomUser.objects.get(user_email=email)
        except CustomUser.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Generate OTP
        otp = get_random_string(length=6, allowed_chars='0123456789')

        # Store OTP in cache with a timeout (e.g., 5 minutes)
        cache.set(f'otp_{email}', otp, timeout=300)

        # Send OTP via email
        try:
            send_mail(
                'Your OTP Code',
                f'Your OTP code is {otp}',
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )
        except Exception as e:
            return Response({"message": f"Error sending email: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"message": "OTP sent to email"}, status=status.HTTP_200_OK)


class ResetPassword(APIView):
    def post(self, request):
        email = request.data.get('user_email')
        otp = request.data.get('otp')
        new_password = request.data.get('new_password')

        # Verify OTP
        cached_otp = cache.get(f'otp_{email}')
        if cached_otp != otp:
            return Response({"message": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

        # Reset password
        user = get_object_or_404(CustomUser, user_email=email)
        user.user_password = make_password(new_password)  # Hash the password before saving
        user.save()

        # Invalidate OTP
        cache.delete(f'otp_{email}')

        return Response({"message": "Password reset successfully"}, status=status.HTTP_200_OK)


@csrf_exempt
def google_login(request):
    if request.method == 'POST':
        try:
            body = json.loads(request.body.decode('utf-8'))
            token = body.get('token')
            if not token:
                return JsonResponse({'error': 'Token is required'}, status=400)

            # Validate token with Google's API
            url = f'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={token}'
            http = urllib3.PoolManager()
            response = http.request('GET', url)
            data = json.loads(response.data.decode('utf-8'))

            # Retrieve email from the data
            email = data.get('email')

            # Check if the email exists in your CustomUser model
            try:
                user = CustomUser.objects.get(user_email=email)
                registration_status = user.registration_status

                # Update user_status to True
                user.user_status = True
                user.save()  # Save changes to the database
                
                # Get the updated user_status
                user_status = user.user_status

            except CustomUser.DoesNotExist:
                return JsonResponse({'error': 'User not found'}, status=404)

            return JsonResponse({
                'user_id': user.user_id,
                'user_email': user.user_email,
                'user_first_name': user.user_first_name,
                'user_last_name': user.user_last_name,
                'user_status': user_status,  # Include user_status
                'registration_status': user.registration_status  # Include registration_status
            }, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except urllib3.exceptions.HTTPError as e:
            return JsonResponse({'error': str(e)}, status=500)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Only POST method is allowed'}, status=405)

def verify_otp(request):
    try:
        data = request.data
        email = data.get('user_email')
        otp = data.get('user_otp')

        if not email or not otp:
            return Response({'error': 'Email and OTP are required'}, status=400)

        # Retrieve OTP from cache
        cached_otp = cache.get(f'otp_{email}')

        if cached_otp != otp:
            return Response({'error': 'Invalid OTP'}, status=400)

        # OTP is valid; fetch user details
        user = get_object_or_404(CustomUser, user_email=email)

        # Log the user in
        request.user = user
        auth_login(request, user)

        # Ensure session ID is created and available
        if not request.session.session_key:
            request.session.create()  # Create a new session if it doesn't exist

        session_id = request.session.session_key

        # Set session expiry
        request.session.set_expiry(timedelta(minutes=60))  # Set session expiry to 60 minutes or adjust as needed

        # Return success response with session ID and registration status
        response_data = {
            'user_id': user.user_id,
            'user_first_name': user.user_first_name,
            'user_email': user.user_email,
            'user_phone_number': user.user_phone_number,
            'session_id': session_id,  # Include session ID in response
            'registration_status': user.registration_status  # Include registration status
        }
        return Response(response_data, status=200)

    except Exception as e:
        return Response({'error': str(e)}, status=500)


class LogoutView(APIView):
    def post(self, request):
        from django.contrib.auth import logout

        logout(request)
        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)


class ValidateSessionView(APIView):
    def post(self, request):
        session_id = request.data.get('session_id')

        try:
            payload = jwt.decode(session_id, SECRET_KEY, algorithms=['HS256'])
            user = CustomUser.objects.get(user_id=payload['user_id'])

            return Response({
                'user_id': user.user_id,
                'user_first_name': user.user_first_name,
                'user_email': user.user_email
            }, status=status.HTTP_200_OK)

        except (jwt.ExpiredSignatureError, jwt.DecodeError):
            return Response({'message': 'Invalid or expired session'}, status=status.HTTP_401_UNAUTHORIZED)
        except CustomUser.DoesNotExist:
            return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


class TokenObtainPairView(APIView):
    def post(self, request):
        email = request.data.get('user_email')
        password = request.data.get('user_password')

        user = authenticate(email=email, password=password)
        if user is None:
            return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        })


class PasswordResetView(APIView):
    def post(self, request):
        email = request.data.get('user_email')
        new_password = request.data.get('new_password')

        try:
            user = CustomUser.objects.get(user_email=email)
            user.user_password = make_password(new_password)
            user.save()
            return Response({'message': 'Password has been reset'}, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


def get_fiat_wallet_id(request, user_id):
    try:
        wallet = FiatWallet.objects.filter(user_id=user_id).first()
        if wallet:
            return JsonResponse({'fiat_wallet_id': wallet.fiat_wallet_id})
        else:
            # Return null if the wallet does not exist
            return JsonResponse({'fiat_wallet_id': None})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)