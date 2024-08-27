# users/views.py
from datetime import timedelta, timezone
import json
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from requests import Session
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
import urllib3
from signup.models import CustomUser
from .serializers import  LoginSerializer
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
from django.utils import timezone

logger = logging.getLogger(__name__)

# class ProjectViewSet(viewsets.ModelViewSet):
#     queryset = Project.objects.all()
#     serializer_class = ProjectSerializer


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            password = request.data.get('user_password')

            if not user.check_password(password):
                return Response({"detail": "Incorrect email or password"}, status=status.HTTP_400_BAD_REQUEST)

            # Generate session ID
            session_id = get_random_string(length=32)
            expiration_time = timezone.now() + timedelta(days=30)  # Set expiration for 1 month

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
                "user_id": user.user_id,
                # "session_id": session_id,
                "user_email": user.user_email,
                # "session_expiration": expiration_time,
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
            
            url = f'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={token}'
            http = urllib3.PoolManager()
            response = http.request('GET', url)
            data = json.loads(response.data.decode('utf-8'))
            
            # Retrieve email from the data
            email = data.get('email')

            # Check if the email exists in your CustomUser model
            try:
                user = CustomUser.objects.get(user_email=email)
                
                # # Log the user in and create a session
                # auth_login(request, user)
                
                return JsonResponse({
                    'user_id': user.user_id,
                    'user_email': user.user_email,
                    'user_first_name': user.user_first_name,
                    # 'user_phone_number': user.user_phone_number,
                    # Add other fields as needed
                }, status=200)
            except CustomUser.DoesNotExist:
                return JsonResponse({'error': 'User not found'}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except urllib3.exceptions.HTTPError as e:
            return JsonResponse({'error': str(e)}, status=500)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Only POST method is allowed'}, status=405)   
@api_view(['POST'])
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

        
        user = get_object_or_404(CustomUser, user_email=email)

       
        request.user = user
        auth_login(request, user)

        
        if not request.session.session_key:
            request.session.create()  

        session_id = request.session.session_key

        
        request.session['userid'] = user.user_id  
        request.session['useremail']=user.user_email

        
        request.session.set_expiry(timedelta(minutes=3))  
        logger.debug(f"Session User ID: {request.session.get('userid')}")
        logger.debug(f"Session User ID: {request.session.get('useremail')}")
        
        response_data = {
            'user_id': user.user_id,
            'user_first_name': user.user_first_name,
            'user_email': user.user_email,
            'user_phone_number': user.user_phone_number,
            'session_id': session_id , 
            'userid':request.session.get('userid')
        }
        return Response(response_data, status=200)
        
    
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    
        

def check_session(request):
    try:
        session_id = request.headers.get('Authorization').replace('Bearer ', '')
        session = Session.objects.get(session_key=session_id)
        expire_date = session.get_model_class().expire_date
        if expire_date > timezone.now():
            return JsonResponse({'status': 'active', 'user_id': session.get_model_class().get('user_id')}, status=200)
        else:
            return JsonResponse({'status': 'expired'}, status=401)
    except Session.DoesNotExist:
        return JsonResponse({'status': 'invalid'}, status=401)        
class LogoutView(APIView):
    def post(self, request):
        from django.contrib.auth import logout

        logout(request)
        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)

 