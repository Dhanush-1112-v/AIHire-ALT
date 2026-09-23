FROM python:3.11-bookworm

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    openjdk-17-jdk \
    nodejs \
    npm \
    golang \
    ffmpeg \
    curl \
    wget \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY backend/requirements.txt /app/backend/requirements.txt

RUN pip install --no-cache-dir -r /app/backend/requirements.txt

COPY backend /app/backend

WORKDIR /app

EXPOSE 10000

CMD ["sh", "-c", "echo '=== Starting AIHire Backend ==='; python -c \"import sys; sys.path.insert(0, '/app/backend'); import app.main; print('=== AIHire app import successful ===')\"; exec python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-10000} --app-dir /app/backend --log-level info"]