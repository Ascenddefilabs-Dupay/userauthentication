from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet
from .views import register_user,GenerateOTP, RegisterUser, GoogleSignup

router = DefaultRouter()

router.register(r'projects',ProjectViewSet)

urlpatterns = [
    path('',include(router.urls)),
    path('register/', register_user, name='register_user'),
    path('generate-otp/', GenerateOTP.as_view(), name='generate-otp'),
    path('register/', RegisterUser.as_view(), name='register'),
    path('google-signup/', GoogleSignup.as_view(), name='google-signup'),

]
