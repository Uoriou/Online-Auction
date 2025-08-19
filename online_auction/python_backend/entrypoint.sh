#/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

echo "Running migrations..."
python manage.py makemigrations --noinput
python manage.py migrate --noinput

echo "Starting server..."
exec python3 manage.py runserver 0.0.0.0:8000
