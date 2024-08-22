from django.urls import path, include
from rest_framework.routers import DefaultRouter
# from .views import ProjectViewSet
from .views import GenerateOTP, RegisterUser, GoogleSignup,check_email


router = DefaultRouter()

# router.register(r'projects')

urlpatterns = [
    path('',include(router.urls)),
    # path('register/', register_user, name='register_user'),
    path('generate-otp/', GenerateOTP.as_view(), name='generate-otp'),
    path('register/', RegisterUser.as_view(), name='register'),
    path('google-signup/', GoogleSignup.as_view(), name='google-signup'),
    path('check-email/', check_email, name='check-email'),

]
