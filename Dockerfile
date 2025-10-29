# File: ai-chat-frontend/Dockerfile

# --- STAGE 1: Build the React application ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# The API URL is now an environment variable
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN npm run build

# --- STAGE 2: Set up the final Nginx image ---
FROM nginx:stable-alpine
COPY --from=frontend-builder /app/dist /usr/share/nginx/html
# We don't copy nginx.conf here, we'll mount it as a volume
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]