# Riverside Studios — app + worker image (the worker service runs the same
# image with a different command; see compose.yaml).
FROM node:22-alpine

WORKDIR /app

# Install dependencies first so Docker caches this layer between code changes.
COPY package.json package-lock.json ./
RUN npm ci

# Then the code, then the build.
COPY . .
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "run", "start"]
