# Use official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start the app
CMD ["npx", "ts-node", "src/index.ts"] 