from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, DocumentViewSet, check_email_exists, check_old_password
from .views import update_password

router = DefaultRouter()
router.register(r'projects', ProjectViewSet)
router.register(r'documents', DocumentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('check-email/', check_email_exists, name='check-email'),
    path('check-old-password/', check_old_password, name='check-old-password'),
    path('update-password/', update_password, name='update-password'),
]
