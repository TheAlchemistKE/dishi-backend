FROM node:20-alpine3.17 as builder

COPY . ./app

WORKDIR /app

EXPOSE 8081

RUN ls -a

RUN npm install && npm run start
