FROM node:18.16.1-alpine AS build-server
LABEL maintainer Ascensio System SIA <support@onlyoffice.com>
WORKDIR /usr/src/app
COPY ./server/package*.json ./
RUN npm install
COPY server .
RUN yarn build && \
    mv .env_example .env

FROM node:18.16.1-alpine AS build-client
LABEL maintainer Ascensio System SIA <support@onlyoffice.com>
ARG ENABLE_BUNDLE_ANALYZER
ARG SERVER_HOST
ARG POWERUP_NAME
ARG POWERUP_APP_KEY
ENV ENABLE_BUNDLE_ANALYZER=$ENABLE_BUNDLE_ANALYZER \
    BACKEND_HOST=$SERVER_HOST \
    POWERUP_NAME=$POWERUP_NAME \
    POWERUP_APP_KEY=$POWERUP_APP_KEY
WORKDIR /usr/src/app
COPY ./client/package*.json ./
RUN npm install
COPY client .
RUN yarn build

FROM golang:alpine AS proxy
WORKDIR /usr/src/app
COPY proxy .
RUN go build cmd/main.go
EXPOSE 8080
CMD ["./main"]

FROM node:18.16.1-alpine AS server
WORKDIR /usr/src/app
COPY --from=build-server \
     /usr/src/app/dist \
     /usr/src/app/dist
COPY --from=build-server \
     /usr/src/app/node_modules \
     /usr/src/app/node_modules
COPY --from=build-server \
     /usr/src/app/.env \
     /usr/src/app/.env
EXPOSE 1111
CMD [ "node", "dist/main.js" ]

FROM nginx:alpine AS client
COPY --from=build-client \
    /usr/src/app/dist \
    /usr/share/nginx/html
EXPOSE 80
