from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserView, CreateUserView, CustomTokenObtainPairView, CustomTokenRefreshView

router = DefaultRouter()
router.register(r'users', UserView, basename='user')

urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('register/', CreateUserView.as_view(), name='register'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
]