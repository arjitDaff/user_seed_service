# Use an official Node.js runtime as a base image
FROM node:16.20.0

# Set the working directory inside the container
WORKDIR /usr/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the application code to the container
COPY . .

# Build the application
RUN npm run build

COPY .env ./dist

WORKDIR ./dist
# Expose the port your app runs on
EXPOSE 3000

# Define the command to run your application
CMD node app.js
