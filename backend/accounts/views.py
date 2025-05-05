from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializer import UserSerializer, CustomTokenObtainPairSerializer
from .models import User
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth import get_user_model
from django.http import HttpResponse



# Create your views here.
class UserView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True  # <-- esto permite cambios con solo algunos campos
        return super().update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

# Vista para obtener el JWT
# TokenObtainPairView es una vista proporcionada por SimpleJWT 
# que genera un par de tokens JWT (uno de acceso y otro de refresco) cuando el usuario se autentica
# Esta vista permite que los usuarios inicien sesión y reciban un par de tokens (access y refresh).
# En el frontend, cuando el usuario envía su email y contraseña a esta vista, recibe el JWT.
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# Vista para refrescar el token (si necesitas refrescarlo)
# TokenRefreshView se usa para obtener un nuevo token de acceso usando 
# el token de refresco (esto es útil si tu token de acceso expira).
# Sirve para renovar el token de acceso usando el refresh_token cuando expire el acceso.
# Esto es útil para mantener la sesión del usuario activa sin volver a loguearse.
class CustomTokenRefreshView(TokenRefreshView):
    pass

def create_superuser_view(request):
    User = get_user_model()
    if not User.objects.filter(username='admin').exists():
        user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpassword'
        )
        return HttpResponse("Superusuario creado con éxito.")
    return HttpResponse("El superusuario ya existe.")