from rest_framework import serializers
from .models import Cart, CartItem
from ecommerce.serializer import ProductSerializer
from ecommerce.models import Product

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)  # Muestra los datos completos del producto (usando ProductSerializer) cuando se lee el carrito.
    product_id = serializers.PrimaryKeyRelatedField( # Permite enviar solo el ID del producto al añadir un item al carrito.
        queryset=Product.objects.all(),  # QuerySet válido para validación
        source="product",  # Indica que este campo se mapea a la FK product del modelo CartItem
        write_only=True  # Oculta este campo en las respuestas de la API.
    )

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity']  # Incluye ambos campos

class CartSerializer(serializers.ModelSerializer):
    # Usamos el related_name 'items' para acceder a los CartItems relacionados
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        # items viene de la relación entre Cart y CartItem
        fields = ['id', 'user', 'created_at', 'items']