FROM node:16.14.2-alpine3.15
WORKDIR /usr/src/app
USER node
COPY --chown=node:node . /usr/src/app
RUN yarn
ENTRYPOINT ["/usr/src/app/bin/run"]