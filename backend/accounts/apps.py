from django.apps import AppConfig
from django.contrib.auth import get_user_model
from django.db.utils import OperationalError
import logging

class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        try:
            User = get_user_model()
            if not User.objects.filter(username='admin').exists():
                User.objects.create_superuser('admin', 'adminU@admin_us.com', 'persia098$')
                logging.info('Superusuario creado.')
            else:
                logging.info('El superusuario ya existe.')
        except OperationalError:
            # Ocurre cuando la DB aún no está lista, como en migraciones iniciales
            pass