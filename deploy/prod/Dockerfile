FROM node:20.11 as build

COPY . .

RUN npm i \
    npm run build

FROM nginx:1.25 

COPY --from=build ./dist /usr/share/nginx/html
