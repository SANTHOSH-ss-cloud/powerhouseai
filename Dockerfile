FROM node:20-alpine

WORKDIR /app

# Copy package configuration
COPY package*.json ./

# Install dependencies separately to leverage Docker cache
RUN npm ci

# Copy application source
COPY . .

# Build the React frontend
RUN npm run build

# Expose the correct port
EXPOSE 3001

# Start the Express server
CMD ["npx", "tsx", "server.ts"]
