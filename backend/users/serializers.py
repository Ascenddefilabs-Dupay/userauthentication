from datetime import date
from rest_framework import serializers
from myapp.models import CustomUser, Project
# from django.contrib.auth import authenticate

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'


class LoginSerializer(serializers.Serializer):
    user_email = serializers.EmailField()
    user_password = serializers.CharField(write_only=True)

    def validate(self, data):
        user_email = data.get('user_email')
        user_password = data.get('user_password')
        try:
            user = CustomUser.objects.get(user_email=user_email, user_password=user_password)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("Incorrect email or password")

        data['user'] = user
        return data