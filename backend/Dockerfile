FROM python:3.11-slim

# Establecer el directorio de trabajo
WORKDIR /app/backend

# Instalar dependencias del sistema
RUN apt-get update && \
    apt-get install -y --no-install-recommends postgresql-client && \
    rm -rf /var/lib/apt/lists/*

# Copiar dependencias primero para aprovechar cache
COPY ./requirements.txt ./

# Instalar dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el script de entrada y darle permisos
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Copiar el resto del código
COPY . .

# Exponer puerto de la app
EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]

CMD python manage.py migrate && \
    python backend/create_admin.py && \
    python manage.py collectstatic --noinput && \
    gunicorn django_ecommerce_api.wsgi:application --bind 0.0.0.0:$PORT
