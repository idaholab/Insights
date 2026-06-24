FROM node:18 as build-deps

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM nginx:latest
COPY --from=build-deps /usr/src/app/dist /usr/share/nginx/html
COPY --from=build-deps /usr/src/app/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
