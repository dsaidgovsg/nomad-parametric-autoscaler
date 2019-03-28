FROM node:carbon as builder
WORKDIR /usr/src/app
ADD . /usr/src/app

RUN npm install
RUN npm rebuild node-sass
RUN npm run build

FROM node:10-alpine as deploy
WORKDIR /app
COPY --from=builder /usr/src/app/build ./build
COPY --from=builder /usr/src/app/write-config.js ./

RUN npm install -g serve

ARG PORT=5000
ENV PORT ${PORT}

EXPOSE ${PORT}

CMD ["sh", "-c", "node ./write-config.js && exec serve -s build -l ${PORT}"]
