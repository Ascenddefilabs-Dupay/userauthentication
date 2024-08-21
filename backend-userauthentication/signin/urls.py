from django.urls import path, include
from rest_framework.routers import DefaultRouter


from .views import *



router = DefaultRouter()
router.register(r'projects', ProjectViewSet)


urlpatterns = [
    path('', include(router.urls)),
    # path('login/', LoginView.as_view(), name='login'),
    
    path('login/', LoginView.as_view(), name='login'),
    path('generate-otp/', GenerateOTP.as_view(), name='generate-otp'),
    path('reset-password/', ResetPassword.as_view(), name='reset-password'),
    path('google-login/', google_login, name='google_login'),
     path('verify-otp/', verify_otp, name='verify_otp'),
   
]