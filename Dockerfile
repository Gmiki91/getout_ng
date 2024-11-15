FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . .
RUN npm run build:ssr

FROM nginx:alpine AS nginx
COPY nginx.conf /etc/nginx/nginx.conf

FROM node:20-alpine AS server
WORKDIR /app
RUN apk add --no-cache nginx
COPY --from=build /app/dist/getout_ng /app/dist/getout_ng
COPY --from=nginx /etc/nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 4000

# Start Nginx and Node server
CMD ["sh", "-c", "nginx & node dist/getout_ng/server/server.mjs"]
# docker build -t angular_image .

