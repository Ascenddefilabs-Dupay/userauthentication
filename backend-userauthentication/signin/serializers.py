from datetime import date
from rest_framework import serializers
from signup.models import CustomUser, Project
# from django.contrib.auth import authenticate
from django.contrib.auth.hashers import check_password
from django.contrib.auth import authenticate
import logging

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'




class LoginSerializer(serializers.Serializer):
    user_email = serializers.EmailField()
    user_password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('user_email')
        password = data.get('user_password')

        try:
            user = CustomUser.objects.get(user_email=email)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError({"detail": "Incorrect email or password"})

        # Debugging statements
        print(f"Input Password: {password}")
        print(f"Stored Hashed Password: {user.user_password}")

        # Verify password
        if not check_password(password, user.user_password):
            raise serializers.ValidationError({"detail": "Incorrect email or password"})

        data['user'] = user
        return data