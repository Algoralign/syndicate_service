# Base image
FROM --platform=linux/amd64 node:18
# FROM node:18

ENV NODE_TLS_REJECT_UNAUTHORIZED=0

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock to the container
COPY package.json yarn.lock ./

# Install app dependencies using yarn
RUN yarn install --frozen-lockfile

# Bundle app source
COPY . .

# Copy only the build artifacts to the container
COPY ./dist /usr/src/app/dist

# Expose the port on which the app will run
EXPOSE 5001

# Start the server using the production build
CMD ["yarn", "start:prod"]
