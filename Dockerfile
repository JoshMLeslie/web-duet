# 
# App Build
# 
FROM node:15-alpine3.10 as builder
LABEL author="Josh Leslie"
ENV PORT 8080

RUN ["npm", "install", "-g", "@angular/cli"]

WORKDIR /web-duet

ADD src src
ADD .npmignore .
ADD angular.json .
ADD tsconfig.json .
ADD tsconfig.app.json .
ADD package.json .

# install dependencies
RUN ["npm", "install", "--no-audit"]
RUN ["npm", "run", "build:prod:docker"]
RUN ["sh", "-c", "mv ./src/server ./build/server"]

# cleanup
RUN ["rm", "-rf", "src", "angular.json", "tsconfig.json", "build", ".npmignore"]

RUN ["ls", "-la"]

# run ng serve on localhost
RUN npm run prod:docker

# 
# NGINX
# 

FROM nginx
LABEL author="Josh Leslie"
COPY --from=builder /web-duet /usr/share/nginx/www
COPY nginx.conf /etc/nginx/nginx.coRUNnf

# create log dir configured in nginx.conf
RUN mkdir -p /var/log/app_engine

# Create a simple file to handle heath checks. Health checking can be disabled
# in app.yaml, but is highly recommended. Google App Engine will send an HTTP
# request to /_ah/health and any 2xx or 404 response is considered healthy.
# Because 404 responses are considered healthy, this could actually be left
# out as nginx will return 404 if the file isn't found. However, it is better
# to be explicit.
RUN mkdir -p /usr/share/nginx/www/_ah && \
    echo "healthy" > /usr/share/nginx/www/_ah/health

RUN chmod -R a+r /usr/share/nginx/www