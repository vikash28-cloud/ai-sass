# 1️⃣ Base image for building
FROM node:18-alpine AS builder

WORKDIR /app

# Copy only package files first (for caching)
COPY package.json package-lock.json ./

RUN npm install

# Copy the rest of the project
COPY . .

# start app
CMD ["npm", "run", "dev"]
