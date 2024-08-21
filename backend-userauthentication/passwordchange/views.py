from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework import status
from .models import CustomUser, Project
from .serializers import ProjectSerializer, DocumentSerializer
from django.contrib.auth.hashers import make_password, check_password

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = DocumentSerializer


@api_view(['POST'])
def update_password(request):
    user_email = request.data.get('user_email')
    current_password = request.data.get('user_password')
    new_password = request.data.get('new_password')
    verify_new_password = request.data.get('verify_new_password')

    if new_password != verify_new_password:
        return Response({'message': 'New passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = CustomUser.objects.get(user_email=user_email)

        # Check if the current password is correct
        if not check_password(current_password, user.user_password):
            return Response({'message': 'Old password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

        # Update the password
        user.user_old_password = user.user_password  # Store the current hashed password in user_old_password
        user.user_password = make_password(new_password)  # Store the new password after hashing it

        user.save()

        return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)

    except CustomUser.DoesNotExist:
        return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def check_email_exists(request):
    user_email = request.GET.get('email', None)
    exists = CustomUser.objects.filter(user_email=user_email).exists()
    return JsonResponse({'exists': exists})


@api_view(['POST'])
def check_old_password(request):
    user_email = request.data.get('user_email')
    user_password = request.data.get('user_password')

    try:
        user = CustomUser.objects.get(user_email=user_email)
        valid = check_password(user_password, user.user_password)  # Use check_password to validate the password
        return JsonResponse({'valid': valid})

    except CustomUser.DoesNotExist:
        return JsonResponse({'valid': False})

    except Exception as e:
        return JsonResponse({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
