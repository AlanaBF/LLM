# Stage 1: Build the React frontend
FROM node:20-slim AS frontend-build
WORKDIR /app/frontend/LeTraducteur
COPY frontend/LeTraducteur/package*.json ./
RUN npm ci
COPY frontend/LeTraducteur/ ./
RUN npm run build

# Stage 2: Python backend
FROM python:3.11-slim
WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

COPY backend/ .
COPY --from=frontend-build /app/backend/static/dist ./static/dist

EXPOSE 7860

ENV FLASK_APP=app.py

CMD ["sh", "-c", "gunicorn -w 2 -b 0.0.0.0:${PORT:-7860} app:app"]
