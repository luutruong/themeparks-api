ARG NODE_IMAGE=node:16.17.0-alpine

FROM ${NODE_IMAGE}

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN apk add --update --no-cache g++ make python3
RUN ln -s /usr/bin/python3 /usr/bin/python
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

ENV NODE_ENV=production

CMD ["yarn", "start"]