# Phase 1: Build the Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY client/package*.json ./client/
RUN cd client && npm install
COPY client/ ./client/
RUN cd client && npm run build

# Phase 2: Setup the Server
FROM node:20-alpine
WORKDIR /app
# Copy server files
COPY server/package*.json ./server/
RUN cd server && npm install
COPY server/ ./server/
# Copy frontend build from Phase 1
COPY --from=frontend-builder /app/client/dist ./client/dist

# EXPOSE and ENV
EXPOSE 3001
ENV PORT=3001
ENV NODE_ENV=production

# Updated CMD to run from the server directory
CMD ["npm", "--prefix", "server", "start"] 
