FROM node:14 AS build
WORKDIR /usr/src/app
COPY package*.json yarn.lock ./
RUN npm install
RUN yarn
COPY . .
RUN yarn build

FROM nginx:1.19-alpine as deploy
COPY --from=build /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
