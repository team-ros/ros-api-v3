FROM ubuntu:latest

RUN apt update
RUN apt install -y curl sudo
RUN curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
RUN apt update
RUN apt install -y nodejs

WORKDIR /usr/app

COPY . .

RUN npm run install

RUN npm run build

CMD [ "node", "./lib/index.js" ]
