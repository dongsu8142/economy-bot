FROM node:17.5.0-alpine AS builder

WORKDIR /app
COPY package.json .
RUN apk add g++ make python3
RUN yarn
COPY . .
RUN yarn build

FROM node:17.5.0-alpine
WORKDIR /app
RUN apk add g++ make python3
COPY --from=builder /app/dist /app
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app
CMD [ "yarn", "start:docker" ]