import re
from django.db import models

# Create your models here.
class Project(models.Model):
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=100)

    def __str__(self):
        return self.name

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
    user_address_line_2 = models.CharField(max_length=255) 
    user_pin_code = models.BigIntegerField()
    user_state = models.CharField(max_length=50)  
    user_profile_photo = models.CharField(max_length=255, blank=True, null=True)
    user_password = models.CharField(max_length=255)
    user_type = models.CharField(max_length=50)
    user_joined_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'users'
    
    def __str__(self):
        return f"{self.user_first_name} {self.user_last_name}"
    
    def save(self, *args, **kwargs):
        if not self.user_id:
            self.user_id = self.generate_user_id()
        super().save(*args, **kwargs)

    def generate_user_id(self):
        latest_user = CustomUser.objects.order_by('-user_id').first()
        if latest_user and re.search(r'\d+', latest_user.user_id):
            last_id = latest_user.user_id
            number = int(re.search(r'\d+', last_id).group())
            new_number = number + 1
            return f'dupC{new_number:04d}'
        return 'dupC0001'
