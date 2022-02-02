FROM node:current-alpine AS build-server
LABEL maintainer Ascensio System SIA <support@onlyoffice.com>
WORKDIR /usr/src/app
COPY ./server/package*.json ./
RUN npm install
COPY server .
RUN npm run build && \
    mv .env_example .env

FROM node:current-alpine AS build-client
LABEL maintainer Ascensio System SIA <support@onlyoffice.com>
WORKDIR /usr/src/app
COPY ./client/package*.json ./
RUN npm install
COPY client .
RUN mv .env.example .env && \
    npm run build

FROM golang:alpine AS proxy
WORKDIR /usr/src/app
COPY proxy .
RUN go build cmd/main.go
EXPOSE 8080
CMD ["./main"]

FROM node:current-alpine AS server
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
CMD ["nginx", "-g", "daemon off;"]
