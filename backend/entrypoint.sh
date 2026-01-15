#!/bin/sh
set -e

echo "Executando migrações..."
python manage.py migrate --noinput

echo "Iniciando servidor..."
exec "$@"

