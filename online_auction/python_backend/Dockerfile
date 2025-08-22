FROM python:3.11
WORKDIR /app
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
# Change this, i need to run entrypoint.sh first to apply migrations
#ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]

