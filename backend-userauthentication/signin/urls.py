from django.urls import path, include
from rest_framework.routers import DefaultRouter


from .views import *
from .views import get_fiat_wallet_id, GoogleSignInView


router = DefaultRouter()
# router.register(r'projects', ProjectViewSet)
router.register(r'google-signin', GoogleSignInView, basename='google-signin')


urlpatterns = [
    path('', include(router.urls)),
    # path('login/', LoginView.as_view(), name='login'),
    
    path('login/', LoginView.as_view(), name='login'),
    path('generate-otp/', GenerateOTP.as_view(), name='generate-otp'),
    path('reset-password/', ResetPassword.as_view(), name='reset-password'),
    path('google-login/', google_login, name='google_login'),
    path('verify-otp/', verify_otp, name='verify_otp'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('fiat_wallet/<str:user_id>/', get_fiat_wallet_id, name='get_fiat_wallet_id'),
    path('fiat_wallet/<str:user_id>/', get_fiat_wallet_id, name='get_fiat_wallet_id'),
   
]