# FROM node:17.5.0-alpine AS base

# WORKDIR /app

# RUN apk add --no-cache g++ make python3 jpeg-dev cairo-dev giflib-dev pango-dev

FROM node:17.5.0-alpine AS builder

WORKDIR /app
RUN apk add --no-cache g++ make python3 jpeg-dev cairo-dev giflib-dev pango-dev
COPY package.json .
RUN yarn
COPY . .
RUN yarn build

FROM node:17.5.0-alpine

WORKDIR /app
COPY --from=builder /app/dist /app
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app
CMD [ "yarn", "start:docker" ]