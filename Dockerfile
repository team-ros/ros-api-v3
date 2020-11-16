FROM ubuntu:latest

RUN apt update
RUN apt install -y curl
RUN curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
RUN apt update
RUN apt install -y nodejs

WORKDIR /usr/app

RUN apt install sudo

COPY package*.json .

RUN npm run install

COPY . .

RUN npm run build

CMD [ "node", "./lib/index.js" ]
