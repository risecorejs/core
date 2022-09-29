FROM node:16.7.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npx tsc

COPY . .

CMD npm run start
