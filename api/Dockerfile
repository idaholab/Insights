FROM node:18 as build-step

WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm install
COPY . ./
RUN npm run build
RUN find node_modules -name '*.node' -exec cp '{}' build/ \;

FROM node:18

RUN mkdir -p /home/node/insights-api
WORKDIR /home/node/insights-api

COPY --from=build-step /usr/src/app/build ./build
COPY --from=build-step /usr/src/app/store ./store
COPY --from=build-step /usr/src/app/db/insights/insights.db ./insights.db
COPY ./package.json ./

CMD ["node", "build/app.js"]
