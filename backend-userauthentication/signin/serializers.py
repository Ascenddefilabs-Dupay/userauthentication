from datetime import date
from rest_framework import serializers
from signup.models import CustomUser
# from django.contrib.auth import authenticate
from django.contrib.auth.hashers import check_password
from django.contrib.auth import authenticate
import logging

# class ProjectSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Project
#         fields = '__all__'




class LoginSerializer(serializers.Serializer):
    user_email = serializers.EmailField()
    user_password = serializers.CharField()

    def validate(self, data):
        email = data.get('user_email')
        password = data.get('user_password')

        try:
            user = CustomUser.objects.get(user_email=email)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password")

        if not user.check_password(password):
            raise serializers.ValidationError("Invalid email or password")

        data['user'] = user
        return data