FROM node:12-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . /app

RUN node ./node_modules/.bin/ng build --prod

FROM nginx:1.17-alpine

COPY nginx/intch.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]