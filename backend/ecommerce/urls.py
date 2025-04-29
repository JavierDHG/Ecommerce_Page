from django.urls import path, include
# El DefaultRouter genera automáticamente las rutas necesarias para las vistas basadas en ModelViewSet
from rest_framework.routers import DefaultRouter
from .views import EcommerceView, CategoryView

# Creamos un router para registrar las vistas
router = DefaultRouter()
# router.register(r'products', EcommerceView, basename='product') crea rutas 
# para la vista EcommerceView bajo el prefijo products.
# el parametro basename es el prefijo de las rutas generadas por el router
router.register(r'products', EcommerceView, basename='product')
router.register(r'categories', CategoryView, basename='category')

# Incluimos las rutas generadas por el router
# api versioning
urlpatterns = [
    path('api/v1/', include(router.urls)),
]

# Estas rutas generan los:
# get, post, put, delete, list