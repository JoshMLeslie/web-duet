# WebDuet

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.1.2.

# Deployment Noise

## app.yaml
Contains deployment instructions for `gcloud app deploy`

## Dockerfile
Hosts the multi-stage docker instructions that:
- 1 - node14 container - builds the Angular app
- 2 - nginx container  - copys build files + nginx.conf to expected location(s) in the container, then starts nginx

## nginx.conf
Contains the configuration for the nginx instance started by Docker

# Angular Noise
## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
