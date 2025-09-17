# Use Node.js 20 as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Set environment variables for Docker
ENV DB_HOST=mysql
ENV DB_PORT=3306
ENV DB_USERNAME=nestuser
ENV DB_PASSWORD=nestpassword
ENV DB_DATABASE=${MYSQL_DATABASE:-crud_nest}
ENV secret=kmdvhbsfkmjbvmksbksfkmvbffbvbvvbjkfvbblhfvlzBLVBIbbvgimUBGIzBGBIMUimrRGBmruirvbgmigrui

# Expose port (will be configurable via docker-compose)
EXPOSE ${PORT:-3010}

# Start the application
CMD ["yarn", "start:prod"]