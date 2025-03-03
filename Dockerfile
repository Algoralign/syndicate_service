# Base image
FROM --platform=linux/amd64 node:18

ENV NODE_TLS_REJECT_UNAUTHORIZED=0

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first (for caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --omit=dev  # Use `npm ci` for reproducible builds, `--omit=dev` for production

# Copy the rest of the application
COPY . .

# Build the project inside the container
RUN npm run build  # Ensures dist/ exists

# Expose the port
EXPOSE 5002

# Start the server
CMD ["npm", "run", "start:prod"]
