# Base image
FROM --platform=linux/amd64 node:18

ENV NODE_TLS_REJECT_UNAUTHORIZED=0

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) to the container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy the entire app source
COPY . .

# **Build the app before running**
RUN npm run build

# Expose the port on which the app runs
EXPOSE 5002

# Start the server using the production build
CMD ["npm", "run", "start:prod"]
