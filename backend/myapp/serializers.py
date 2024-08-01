from datetime import date
import re
from rest_framework import serializers
from .models import Project,CustomUser
from django.core.files.base import ContentFile
import base64


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'user_email', 'user_first_name', 'user_middle_name', 'user_last_name', 
            'user_dob', 'user_phone_number', 'user_country', 'user_city', 
            'user_address_line_1', 'user_address_line_2', 'user_pin_code', 
            'user_state', 'user_profile_photo', 'user_password', 'user_type'
        ]
        extra_kwargs = {
            'user_password': {'write_only': True},
            'user_profile_photo': {'required': False}
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
