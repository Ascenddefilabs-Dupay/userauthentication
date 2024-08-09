from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework import status
from .models import CustomUser, Project
from .serializers import ProjectSerializer, DocumentSerializer

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
    user_old_password = request.data.get('new_password')
    verify_new_password = request.data.get('verify_new_password')

    if user_old_password != verify_new_password:
        return Response({'message': 'New passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = CustomUser.objects.get(user_email=user_email)

        # Check if the old password matches
        if user.user_password != current_password:
            return Response({'message': 'Old password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

        # Debugging: Print the current and new passwords before update
        print(f"Current password (user_password): {user.user_password}")
        print(f"New password to be set: {user_old_password}")

        # Update the password
        user.user_old_password = current_password  # Store the old password in new_password field
        user.user_password = user_old_password  # Store the new password in user_password field

        # Debugging: Print the new_password before saving
        print(f"Password to be stored in new_password: {user.user_old_password}")

        user.save()

        # Debugging: Print the fields after saving
        user.refresh_from_db()
        print(f"Stored new_password: {user.user_old_password}")
        print(f"Stored user_password: {user.user_password}")

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
    valid = CustomUser.objects.filter(user_email=user_email, user_password=user_password).exists()
    return JsonResponse({'valid': valid})
    
