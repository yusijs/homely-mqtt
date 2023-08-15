FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install python
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache build-base python3 && ln -sf python3 /usr/bin/python

# Install dependencies
RUN npm install

# Copy app source code
COPY . .

# Build
RUN npm run build

# Run app
WORKDIR /app/dist
CMD [ "node", "index.js" ]