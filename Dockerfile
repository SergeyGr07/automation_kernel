FROM python:3.10-slim


COPY . /app

# Установка рабочей директории внутри контейнера
WORKDIR /app
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Запускаем Flask-приложение
CMD ["python3", "app.py"]


