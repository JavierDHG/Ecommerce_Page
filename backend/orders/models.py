from django.db import models
from django.conf import settings
from accounts.models import User
from ecommerce.models import Product

# Create your models here.
class Order(models.Model):
    # models.ForeignKey porque cada orden pertenece a un solo usuario
    # on_delete=models.CASCADE significa que si se elimina el usuario, se elimina la orden
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=False)
    total_price = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    # is_paid = models.BooleanField(default=False) es para saber si el pedido ya fue pagado
    is_paid = models.BooleanField(default=False)

    def __str__(self):
        return f"Pedido #{self.id} x {self.user.username} - Total: {self.total_price}"
    
    class Meta:
        verbose_name = 'Pedido'
        verbose_name_plural = 'Pedidos'

class OrderItem(models.Model):
    # models.ForeignKey porque cada orden tiene muchos items
    order = models.ForeignKey('Order', on_delete=models.CASCADE, related_name='items')
    # ecommerce.Product es porque cada item pertenece a un solo producto
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    # metodo para mostrar el nombre del item en el admin panel
    def __str__(self):
        return f"{self.quantity} x {self.product.title}"

class Shipping(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    # OneToOneField porque cada orden tiene un solo envío
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='shipping')
    address = models.CharField(max_length=120)
    city = models.CharField(max_length=120)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=120)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # metodo para mostrar el nombre del envío en el admin panel
    def __str__(self):
        return f"Envío del pedido #{self.order.id} - {self.address} - al usuario {self.user.username}"
    