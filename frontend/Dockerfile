# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json yarn.lock* .npmrc* ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy application code
COPY . .

# Build the application
RUN yarn build

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Install serve to run the production build
RUN npm install -g serve

# Copy built application from builder
COPY --from=builder /app/build ./build

# Copy public assets if they exist
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
