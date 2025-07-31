FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:18-alpine AS Production

COPY --from=builder /app/build /app/build

COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN npm install -g serve

CMD ["serve", "-s",, "build", '-l' '3000']