FROM node:slim AS builder
WORKDIR /var/www/
COPY . .

RUN yarn
RUN yarn build

FROM nginx:latest
WORKDIR /var/www/

COPY deployment/ecs/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443

COPY --from=builder /var/www/dist ./dist

CMD ["nginx", "-g", "daemon off;"]
