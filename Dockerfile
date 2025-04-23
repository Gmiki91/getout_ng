# Stage 1: Build Angular app
FROM node:23-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Stage 2: Serve with Nginx
FROM nginx:1.27.5-alpine-slim
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/getout_ng/browser /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]



