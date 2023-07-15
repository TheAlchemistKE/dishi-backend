FROM node:20-alpine3.17 AS builder

COPY . ./app

WORKDIR /app

EXPOSE 8082

RUN ls -a

RUN npm install && npm run build

CMD [ "node", "dist/index.js" ]
