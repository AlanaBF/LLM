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
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .
COPY --from=frontend-build /app/backend/static/dist ./static/dist

RUN useradd -m -u 1000 appuser
USER appuser

EXPOSE 7860

CMD ["gunicorn", "-w", "1", "--timeout", "120", "-b", "0.0.0.0:7860", "app:app"]
