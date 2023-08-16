FROM node:18-alpine

ARG TARGETPLATFORM
# Create app directory
WORKDIR /app

# Copy package-install.sh
COPY package-install.sh ./

# Install build-dependencies on armv7 (not required on arm64)
ENV PYTHONUNBUFFERED=1
RUN ./package-install.sh

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --sqlite=/usr/local

# Copy app source code
COPY . .

# Build
RUN npm run build

# Run app
WORKDIR /app/dist
CMD [ "node", "index.js" ]