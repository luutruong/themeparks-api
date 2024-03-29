ARG NODE_IMAGE=node:18.19.0-alpine

FROM ${NODE_IMAGE}

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build
RUN yarn install --production --frozen-lockfile --prefer-dist

CMD ["yarn", "start"]