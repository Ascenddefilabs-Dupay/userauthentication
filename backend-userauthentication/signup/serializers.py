from datetime import date
import re
from rest_framework import serializers
from .models import CustomUser
from django.core.files.base import ContentFile
import base64
from django.contrib.auth.hashers import check_password, make_password


class GoogleSignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['user_email', 'user_first_name', 'user_last_name']  # Only these fields for Google signup

    def create(self, validated_data):
        user = CustomUser.objects.create(
            user_email=validated_data['user_email'],
            user_first_name=validated_data['user_first_name'],
            user_last_name=validated_data['user_last_name']
        )
        return user


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['user_email', 'user_password']  # Regular signup with password
        extra_kwargs = {
            'user_password': {'write_only': True},
            'user_profile_photo': {'required': False},
            # 'user_type': {'default': 'customer'}
            
        }
       
    def validate_user_first_name(self, value):
        if not re.match("^[A-Za-z]*$", value):
            raise serializers.ValidationError("First name should only contain characters.")
        return value

    def validate_user_last_name(self, value):
        if not re.match("^[A-Za-z]*$", value):
            raise serializers.ValidationError("Last name should only contain characters.")
        return value

    def validate_user_dob(self, value):
        today = date.today()
        age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
        if age < 18:
            raise serializers.ValidationError("You must be at least 18 years old to register.")
        return value

    def create(self, validated_data):
        user = CustomUser(**validated_data)
        # Ensure you hash the password
        # user.set_password(validated_data['user_password'])
        user.save()
        return user

    def to_internal_value(self, data):
        if 'user_profile_photo' in data and data['user_profile_photo'].startswith('data:image'):
            try:
                format, imgstr = data['user_profile_photo'].split(';base64,')
                ext = format.split('/')[-1]
                imgstr += '=' * (-len(imgstr) % 4)  # Correct padding
                image_data = base64.b64decode(imgstr)
                file_path = f'profile_photos/temp.{ext}'
                with open(file_path, 'wb') as f:
                    f.write(image_data)
                data['user_profile_photo'] = file_path
            except (TypeError, base64.binascii.Error):
                raise serializers.ValidationError({'user_profile_photo': 'Invalid image data.'})
        return super().to_internal_value(data)
