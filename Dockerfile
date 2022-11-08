ARG NODE_IMAGE=node:18.11-alpine

FROM ${NODE_IMAGE}

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN apk add --update --no-cache g++ make python3
RUN ln -s /usr/bin/python3 /usr/bin/python
RUN yarn install --frozen-lockfile --ignore-scripts

COPY . .
RUN yarn build

CMD ["yarn", "start"]