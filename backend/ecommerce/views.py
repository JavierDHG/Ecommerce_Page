# se encarga de serializar los productos
from rest_framework import viewsets
from .serializer import ProductSerializer, CategorySerializer
from .models import Product, Category
from rest_framework.permissions import AllowAny

# Create your views here.
# Esta clase es para mostrar la informacion de los productos


class EcommerceView(viewsets.ModelViewSet):
    permission_classes = [AllowAny]  # Permite acceso público
    # serializer_class es para serializar los productos
    serializer_class = ProductSerializer
   # Filtra solo productos disponibles (stock > 0)
    queryset = Product.objects.all()
    # queryset = Product.objects.filter(stock__gt=0)  # __gt = greater than (mayor que)
    # Esto te permitirá buscar productos por título o descripción ejemplo ?search=zapato.
    search_fields = ['title', 'description']

    # Bloquea el registro durante la actualización
    class Meta:
        select_on_save = True  # Habilita bloqueo optimista


class CategoryView(viewsets.ModelViewSet):
    permission_classes = [AllowAny]  # Permite acceso público
    serializer_class = CategorySerializer
    queryset = Category.objects.all()
