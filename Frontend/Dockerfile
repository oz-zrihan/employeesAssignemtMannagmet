
# Linux Alpine 3.17.x + Node.js
FROM node:18-alpine3.17

# Create out application directory
WORKDIR /app

# Copy only package.json and package-lock.json
COPY package*.json /app

# Restore node_modules
RUN npm i

# Take current directory and copy it into /app inside the image
COPY . /app

# When container runs - which commend should we use to run our app
ENTRYPOINT npm start


