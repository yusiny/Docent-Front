# (1) 빌드
FROM node:18.12.1 as builder

RUN mkdir /app
WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn install 

COPY . .
RUN yarn build

# (2) Node 실행
FROM node:18.16.0-alpine
COPY --from=builder /app/.output /app/.output

ENV NODE_TLS_REJECT_UNAUTHORIZED=0
ENV NODE_ENV=prod

CMD ["node", "/app/.output/server/index.mjs" ]