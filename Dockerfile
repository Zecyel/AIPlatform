# Stage 1: Builder
FROM node:18-alpine AS builder

# Install build dependencies
RUN apk add --no-cache build-base clang

# Set the working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Copy presiquite source code
COPY presiquite.cpp ./

# Compile presiquite
RUN clang++ -o presiquite presiquite.cpp

# Make the presiquite script executable
RUN chmod +x ./presiquite

# Verify the binary
RUN ls -las /app

# Run presiquite
RUN ./presiquite

# 复制所有源代码
COPY . .

# Build your application (adjust the build command as needed)
RUN pnpm run build

# Stage 2: Production
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy only the necessary files from the builder stage
COPY --from=builder /app/.output ./.output

# Expose the desired port (e.g., 3000)
EXPOSE 3000

# Define the command to run your application
CMD ["node", ".output/server/index.mjs"]