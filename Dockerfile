ARG NODE_IMAGE=node:16.17.0-alpine

FROM ${NODE_IMAGE} AS deps

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN apk add --update --no-cache g++ make python3
RUN ln -s /usr/bin/python3 /usr/bin/python
RUN yarn install --frozen-lockfile

FROM ${NODE_IMAGE} AS builder

WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN yarn build

FROM ${NODE_IMAGE} AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production

CMD ["yarn", "start"]