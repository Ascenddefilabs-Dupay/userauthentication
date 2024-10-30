import json
from django.shortcuts import render
from rest_framework import viewsets,status
from .models import CustomUser, Project
# from .serializers import ProjectSerializer
from rest_framework.response import Response
from .serializers import CustomUserSerializer,GoogleSignupSerializer
from rest_framework.decorators import api_view
from google.auth.transport import requests
from google.oauth2 import id_token
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.conf import settings 
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt



class RegisterUserView(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    
    def create(self, request, *args, **kwargs):
        email = request.data.get('user_email')
        if CustomUser.objects.filter(user_email=email).exists():
            return Response({'error': 'Email is already in use'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Generate JWT token here if needed
            return Response({'success': 'Registration successful!', 'user_id': user.user_id}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def register_user(request):
    if request.method == 'POST':
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt  # Use with caution; for development or specific use cases
def check_email(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        email_exists = CustomUser.objects.filter(user_email=email).exists()
        return JsonResponse({'exists': email_exists})
    return JsonResponse({'error': 'Method not allowed'}, status=405)
class GenerateOTP(APIView):
    def post(self, request):
        user_email = request.data.get('email')
        otp = request.data.get('otp')

        # Store OTP in the database or cache here, and send it to the user
        send_mail(
            'Your OTP Code',
            f'Your OTP code is {otp}',
            settings.DEFAULT_FROM_EMAIL,
            [user_email],
            fail_silently=False,
        )

        return Response({'success': True, 'message': 'OTP sent successfully'}, status=status.HTTP_200_OK)

class RegisterUser(APIView):
    def post(self, request):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'success': True, 'id': user.user_id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GoogleSignup(APIView):
    def post(self, request):
        id_token_str = request.data.get('idToken')
        try:
            id_info = id_token.verify_oauth2_token(id_token_str, requests.Request(), settings.GOOGLE_CLIENT_ID)
            email = id_info.get('email')
            first_name = id_info.get('given_name', '')
            last_name = id_info.get('family_name', '')

            # Create or update user with Google data
            user, created = CustomUser.objects.get_or_create(
                user_email=email,
                defaults={'user_first_name': first_name, 'user_last_name': last_name}
            )

            if not created:
                user.user_first_name = first_name
                user.user_last_name = last_name
                user.save()

            return Response({'success': True, 'user_id': user.user_id}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

from rest_framework import viewsets, status
from rest_framework.response import Response
from urllib import request as urllib_request, parse, error
import json
from .models import CustomUser
from .serializers import CustomUserSerializer

class GoogleSignUpView(viewsets.ViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

    def create(self, request):
        access_token = request.data.get('access_token')
        if not access_token:
            return Response({'error': 'No access token provided'}, status=status.HTTP_400_BAD_REQUEST)

        # Verify the access token with Google using urllib
        user_info_url = 'https://www.googleapis.com/oauth2/v1/userinfo'
        params = {'access_token': access_token}
        url = f"{user_info_url}?{parse.urlencode(params)}"

        try:
            with urllib_request.urlopen(url) as response:
                user_data = json.loads(response.read().decode())
        except error.HTTPError:
            return Response({'error': 'Invalid access token'}, status=status.HTTP_400_BAD_REQUEST)
        except error.URLError:
            return Response({'error': 'Could not connect to Google'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        google_id = user_data.get('id')
        email = user_data.get('email')
        first_name = user_data.get('given_name', '')
        last_name = user_data.get('family_name', '')

        # Use get_or_create to find or create a new user based on the Google account email
        user, created = CustomUser.objects.get_or_create(
            user_email=email,
            defaults={
                'user_first_name': first_name,
                'user_last_name': last_name,
                
            }
        )

        # Update user's first and last name if they exist
        if not created:
            user.user_email = email
            user.user_first_name = first_name
            user.user_last_name = last_name
            user.save()

        # Use serializer to return data
        serializer = CustomUserSerializer(user)
        return Response({'success': True, 'user_id': user.user_id, 'user': serializer.data}, status=status.HTTP_200_OK)
