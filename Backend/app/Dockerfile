# Use a minimal official Python image
FROM python:3.11-slim

# Create a non-root user for running the application
RUN adduser --disabled-password --gecos '' appuser

# Set environment variables to prevent Python from writing pyc files and buffering output
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Set the working directory
WORKDIR /app

# Install system dependencies required for building Python packages and PostgreSQL support
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
  && rm -rf /var/lib/apt/lists/*

# Copy only the requirements file to leverage Docker caching
COPY requirements.txt .

# Upgrade pip and install dependencies without caching to reduce image size
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the project source code
COPY . .

# Run Django collectstatic to gather static files into STATIC_ROOT (for use with WhiteNoise or a web server)
RUN python manage.py collectstatic --noinput

# Change file ownership to the non-root user for better security
RUN chown -R appuser:appuser /app

# Switch to the non-root user
USER appuser

# Expose the port your Django app will run on
EXPOSE 8000

# Use gunicorn as the production WSGI server, binding to all interfaces and specifying a reasonable number of workers.
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]
