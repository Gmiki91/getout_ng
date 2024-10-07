FROM node:20-alpine AS build

# Copy package.json and package-lock.json to install dependencies
COPY package*.json /app/

# Copy the Angular app's source code
COPY . /app/

WORKDIR /app

RUN npm install

# For production:
# RUN npm run build

CMD ["npm", "start"]
