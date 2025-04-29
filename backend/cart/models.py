from django.db import models
# settings para acceder a la configuración
from django.conf import settings

# Create your models here.
class Cart(models.Model):
    # settings.AUTH_USER_MODEL = 'accounts.User' que se utiliza para acceder al modelo de usuario
    # on_delete=models.CASCADE: si se elimina el usuario, se elimina el carrito
    # related_name='cart': se utiliza para acceder al carrito de un usuario
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cart')
    # created_at = models.DateTimeField(auto_now_add=True) se utiliza para obtener la fecha y hora actual
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.user)

    class Meta:
        verbose_name = 'Carrito'
        verbose_name_plural = 'Carritos'


class CartItem(models.Model):
    # on_delete=models.CASCADE: si se elimina el carrito, se elimina el item
    # related_name='items': se utiliza para acceder a los items de un carrito
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    # on_delete=models.CASCADE: si se elimina el producto, se elimina el item
    # ecommerce.Product: se utiliza para acceder al modelo de producto
    product = models.ForeignKey('ecommerce.Product', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return str(self.product)

    class Meta:
        verbose_name = 'Item de Carrito'
        verbose_name_plural = 'Items de Carrito'