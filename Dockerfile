FROM node:lts-buster

WORKDIR /usr/app

RUN apt install sudo

COPY package*.json .

RUN npm run install

COPY . .

RUN npm run build

CMD [ "node", "./lib/index.js" ]
