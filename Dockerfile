FROM node:lts-buster

WORKDIR /usr/app

COPY package*.json .

RUN npm run install

COPY . .

RUN npm run build

CMD [ "node", "./lib/index.js" ]