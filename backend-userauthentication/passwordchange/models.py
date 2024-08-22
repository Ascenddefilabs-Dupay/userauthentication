from django.db import models
from signup.models import CustomUser

# Create your models here.
class Project(models.Model):
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name
# class users(models.Model):
#     user_id = models.CharField(max_length=8, primary_key=True)
#     user_email = models.EmailField(unique=True)
#     user_first_name = models.CharField(max_length=30)
#     user_middle_name = models.CharField(max_length=30, blank=True)
#     user_last_name = models.CharField(max_length=30)
#     user_dob = models.DateField()
#     user_phone_number = models.BigIntegerField()
#     user_country = models.CharField(max_length=50)
#     user_city = models.CharField(max_length=50)
#     user_address_line_1 = models.CharField(max_length=255)  
#     user_address_line_2 = models.CharField(max_length=255) 
#     user_pin_code = models.BigIntegerField()
#     user_state = models.CharField(max_length=50)  
#     user_profile_photo = models.CharField(max_length=255, blank=True, null=True)
#     user_password = models.CharField(max_length=255)
#     user_type = models.CharField(max_length=50)
#     user_joined_date = models.DateTimeField(auto_now_add=True)

#     class Meta:
#       db_table='users'
#     def __str__(self):
#         return f"{self.email} - {self.document_type}"