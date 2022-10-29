FROM node:16.7.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx tsc

CMD npm run start
