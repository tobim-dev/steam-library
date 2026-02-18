# =============================================================================
# Stage 1: Build Frontend
# =============================================================================
FROM node:22-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# =============================================================================
# Stage 2: Build Backend
# =============================================================================
FROM node:22-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build

# =============================================================================
# Stage 3: Production Runtime
# =============================================================================
FROM node:22-alpine AS production

# Install nginx and supervisor
RUN apk add --no-cache nginx supervisor

# Create necessary directories
RUN mkdir -p /app/data /run/nginx

# Copy backend dist and production dependencies
WORKDIR /app/backend
COPY --from=backend-build /app/backend/dist ./dist
COPY --from=backend-build /app/backend/node_modules ./node_modules
COPY --from=backend-build /app/backend/package.json ./

# Copy frontend static files to nginx html directory
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html

# Copy nginx and supervisor configs
COPY nginx.conf /etc/nginx/http.d/default.conf
COPY supervisord.conf /etc/supervisord.conf

# Remove default nginx config if it exists
RUN rm -f /etc/nginx/http.d/default.conf.bak

# Persistent data volume for SQLite database
VOLUME /app/data

# Environment variables
ENV DB_PATH=/app/data/gaming_library.db
ENV NODE_ENV=production
ENV PORT=3001

# Expose port 80 (nginx)
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/api/settings || exit 1

# Start both nginx and backend via supervisord
CMD ["supervisord", "-c", "/etc/supervisord.conf"]
