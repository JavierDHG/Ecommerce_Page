#!/bin/bash

# Esperar a la base de datos si es necesario
/wait-for-db.sh  # Si tienes este script

# Ejecutar migraciones
python manage.py migrate

# Ejecutar el comando principal (CMD)
exec "$@"