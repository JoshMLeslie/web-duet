# 
# App Build
# 
FROM node:14-alpine3.10 as builder
LABEL author="Josh Leslie"
ENV PORT 8080

RUN npm i -g @angular/cli

WORKDIR /web-duet

ADD src src
ADD angular.json .
ADD tsconfig*.json .
ADD package*.json .

# install dependencies
RUN npm i --no-audit
RUN ng build --prod --output-path ./build
ADD ./src/server .

# cleanup
RUN rm -rf src angular.json tsconfig.json

RUN ls -la

#
# NGINX
#
FROM nginx
LABEL author="Josh Leslie"
COPY --from=builder /web-duet /usr/share/nginx/www
COPY nginx.conf /etc/nginx/nginx.conf

# create log dir configured in nginx.conf
RUN mkdir -p /var/log/app_engine
RUN chmod -R a+r /usr/share/nginx/www

EXPOSE 80
EXPOSE 443

# foreground 'debug' mode
CMD ["nginx", "-g", "daemon off;"]

# background mode
# CMD ["nginx"]