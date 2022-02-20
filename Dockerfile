FROM node:17.5.0-alpine AS base

WORKDIR /app

RUN apk add g++ make python3

FROM base AS builder

COPY package.json .
RUN yarn
COPY . .
RUN yarn build

FROM base

COPY --from=builder /app/dist /app
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app
CMD [ "yarn", "start:docker" ]