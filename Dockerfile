FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:22-alpine AS production

WORKDIR /app

COPY --from=builder /app/build /app/build

RUN npm install -g serve

CMD ["serve", "-s", "build", "-l", "3000"]