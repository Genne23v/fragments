#

FROM node:16.15.1

LABEL maintainer="Wonkeun No <wno@myseneca.ca>"
LABEL description="Fragments node.js microservice"

ENV PORT=8080
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY ./src ./src
COPY ./tests/.htpasswd ./tests/.htpasswd

CMD npm start

EXPOSE 8080