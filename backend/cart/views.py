from rest_framework import viewsets, permissions # permissions permite controlar los permisos de los usuarios
from .serializer import CartItemSerializer, CartSerializer
from .models import Cart, CartItem
from rest_framework_simplejwt.authentication import JWTAuthentication 

class CartItemView(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]  # <-- Requerido para JWT

    def get_queryset(self):
        return CartItem.objects.filter(cart__user=self.request.user)

    def perform_create(self, serializer):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)

        # Obtener el producto y la cantidad desde el serializer
        product = serializer.validated_data['product']
        quantity = serializer.validated_data['quantity']

        # Verificar stock
        if product.stock < quantity:
            raise serializer.ValidationError("No hay suficiente stock disponible")

        # Restar el stock
        product.stock -= quantity
        product.save()

        # Guardar el CartItem
        serializer.save(cart=cart)

    def perform_destroy(self, instance):
        product = instance.product
        product.stock += instance.quantity  # Restaurar el stock
        product.save()
        instance.delete()
            
        

class CartView(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]  # <-- Requerido para JWT

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)
        
