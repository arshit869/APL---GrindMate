# Phase 1: Build the Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
# Copy only what is needed for install
COPY client/package*.json ./client/
RUN cd client && npm install
# Copy rest of client and build
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

# Root setup
COPY package*.json ./
RUN npm install --only=production

EXPOSE 3001
ENV PORT=3001
ENV NODE_ENV=production

CMD ["npm", "run", "server"]

