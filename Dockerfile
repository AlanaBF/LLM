# Use the official Python image from the Docker Hub
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file from the backend folder into the container
COPY backend/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY backend/ .

# Expose the port that the app runs on
EXPOSE 8000

# Define environment variable for Flask
ENV FLASK_APP=app.py

# Install Gunicorn for serving the app
RUN pip install gunicorn

# Run the Flask app
CMD ["sh", "-c", "gunicorn -w 2 -b 0.0.0.0:${PORT:-8000} app:app"]
