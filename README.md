# InScope Tracker Frontend

We are using (see `package.json` for more):

* Angular 2.4.0
* Firebase 4.1.1
* AngularFire2 4.0.0-rc.1
* Bootstrap 3.3.7
* Dragula 3.7.2

## Project Setup

### Prerequisites

Ensure the following tools prior to setting up the application.

* [Node.js](https://nodejs.org/) (version 6+)
* [NPM](https://www.npmjs.com/)

A firebase account is also required. Visit [their page](https://firebase.google.com/) to create one and get started.

### Setup

Clone this repository and add your Firebase credentials in the `firebaseConfig` object located at `src/app/app.module.ts`.

From your terminal move into the InScope directory and run the following command. 

```sh
# install dependencies
$ npm install

# start the development server
$ npm start
```

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.
