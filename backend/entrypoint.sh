#!/bin/bash

# Ejecutar migraciones
python manage.py migrate

# Ejecutar el comando principal (CMD)
exec "$@"

