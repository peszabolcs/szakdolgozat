# Multi-stage build: production-ready ParkVision (frontend + Express API).
# Stage 1: install + build frontend (Vite) and backend (tsc).
FROM node:20-alpine AS builder

WORKDIR /app

# Better-sqlite3 needs build tools to compile.
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build && npm run server:build

# Stage 2: production runtime — only built artifacts + prod deps.
FROM node:20-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
ENV DB_FILE=/data/parkvision.db

RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/server/src ./server/src

# Create data dir for SQLite persistence.
RUN mkdir -p /data

EXPOSE 3001

# We serve the frontend statics through Express in production for a single
# container deployment (alternative: separate nginx container — see compose).
CMD ["node", "server/dist/index.js"]
