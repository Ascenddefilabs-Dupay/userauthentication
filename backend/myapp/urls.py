from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet
from .views import register_user

router = DefaultRouter()

router.register(r'projects',ProjectViewSet)

urlpatterns = [
    path('',include(router.urls)),
    path('register/', register_user, name='register_user'),
]
