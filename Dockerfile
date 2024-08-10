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
EXPOSE 5000

# Accept Hugging Face token as a build argument
ARG HF_AUTH_TOKEN
ENV HF_AUTH_TOKEN=${HF_AUTH_TOKEN}

# Define environment variable
ENV FLASK_APP=app.py

# Install Gunicorn for serving the app
RUN pip install gunicorn

# Run the Flask app
# CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
CMD ["gunicorn", "-w", "2", "-b", "0.0.0.0:5000", "app:app"]
