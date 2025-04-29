from django.db import models

# Create your models here.
# ecommerce/models.py

class Category(models.Model):
    title = models.CharField(max_length=120)


    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Categoría'
        verbose_name_plural = 'Categorías'

class Product(models.Model):
    # Relación con la categoría
    # on_delete=models.SET_NULL: si se borra la categoría, el producto se deja sin categoría
    # null=True: si se borra la categoría, el producto se deja sin categoría
    # related_name='products': para acceder a los productos de una categoría
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    image = models.ImageField(upload_to='media/products/images', blank=True, null=True)
    title = models.CharField(max_length=120)
    # blank=True: si se deja en blanco, no se muestra en el formulario
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=15, decimal_places=2)  # más preciso para precios
    stock = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'
