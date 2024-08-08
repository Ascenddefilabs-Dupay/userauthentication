from rest_framework import serializers
from .models import Project
from .models import CustomUser

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'
class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['user_email', 'user_password', 'user_old_password']
    