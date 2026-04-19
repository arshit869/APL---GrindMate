# Phase 1: Build the Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Phase 2: Setup the Server
FROM node:20-alpine
WORKDIR /app
COPY server/package*.json ./server/
RUN cd server && npm install
COPY server/ ./server/
COPY --from=frontend-builder /app/client/dist ./client/dist

# Root setup
COPY package*.json ./
RUN npm install --only=production

EXPOSE 3001
ENV PORT=3001
ENV NODE_ENV=production

CMD ["npm", "run", "server"]
