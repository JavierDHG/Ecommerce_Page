until pg_isready -h db -p 5432 -U postgres; do
  echo "Esperando a PostgreSQL en db:5432..."
  sleep 2
done
echo "PostgreSQL está listo!"