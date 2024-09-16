from django.utils import timezone
import re
from django.db import models
from django.contrib.auth.hashers import check_password, make_password

class CustomUser(models.Model):
    user_id = models.CharField(max_length=8, primary_key=True)
    user_email = models.EmailField(unique=True)
    user_first_name = models.CharField(max_length=30)
    user_middle_name = models.CharField(max_length=30, blank=True)
    user_last_name = models.CharField(max_length=30)
    user_dob = models.DateField()
    user_phone_number = models.BigIntegerField()
    user_country = models.CharField(max_length=50)
    user_city = models.CharField(max_length=50)
    user_address_line_1 = models.CharField(max_length=255)  
    user_address_line_2 = models.CharField(max_length=255, blank=True) 
    user_pin_code = models.BigIntegerField()
    user_state = models.CharField(max_length=50)  
    user_profile_photo = models.CharField(max_length=255, blank=True, null=True)
    user_password = models.CharField(max_length=255)j
    user_type = models.CharField(max_length=50)
    user_old_password = models.CharField(max_length=128, blank=True, null=True)
    last_login = models.DateTimeField(default=timezone.now, blank=True, null=True)
    registration_status = models.BooleanField(default=False)
    class Meta:
        db_table = 'users'
    
    def __str__(self):
        return f"{self.user_first_name} {self.user_last_name}"
    
    def save(self, *args, **kwargs):
        if not self.user_id:
            self.user_id = self.generate_user_id()

        if not self.pk or not self.user_password.startswith('pbkdf2_sha256$'):
            self.user_password = make_password(self.user_password)

        super().save(*args, **kwargs)

    def check_password(self, raw_password):
        # This checks the hashed password
        return check_password(raw_password, self.user_password)

    def generate_user_id(self):
        # Fetch the last user_id with 'DupC' prefix and numerical suffix
        latest_user = CustomUser.objects.filter(user_id__startswith='DupC').order_by('-user_id').first()
        if latest_user:
            # Extract numerical part and increment
            last_id = latest_user.user_id
            number = int(re.search(r'\d+', last_id).group())
            new_number = number + 1
            return f'DupC{new_number:04d}'
        return 'DupC0001'

class Project(models.Model):
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=100)

    def __str__(self):
        return self.name