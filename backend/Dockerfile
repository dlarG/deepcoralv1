FROM python:3.11-slim

WORKDIR /app

# Install essential system dependencies only
RUN apt-get update && apt-get install -y \
    gcc g++ libpq-dev python3-dev build-essential \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip

# Development stage - install only base requirements
COPY requirements-base.txt .
RUN pip install --no-cache-dir -r requirements-base.txt

# Copy application code
COPY . .
RUN mkdir -p coral_uploads/outputs

EXPOSE 5000
ENV FLASK_APP=app.py FLASK_ENV=development PYTHONPATH=/app

CMD ["python", "app.py"]