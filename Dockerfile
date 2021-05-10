FROM node:15-alpine3.10
LABEL author="Josh Leslie"
ENV PORT 8080

RUN ["apk", "add", "nodejs"]
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

RUN ["ls", "-la"]

RUN ["sh", "-c", "mv ./build/* ./"]
RUN ["sh", "-c", "mv ./src/server ./server"]

RUN ["ls", "-la"]

# cleanup
RUN ["rm", "-rf", "src", "angular.json", "tsconfig.json", "build", ".npmignore"]

# expose port(s)
EXPOSE 8080

# run ng serve on localhost
CMD npm run prod:docker