# Risecorejs - Backend framework for Node.js

## Setup

```sh
npm i -g @risecorejs/core

risecorejs init my-project

cd my-project
```

Copy ".env.example" -> ".env" and add your private key to JWT_SECRET_KEY etc.

> Note: Don't forget to set up your database for the next step!

```sh
npm install && npm install -g nodemon

npx sequelize db:migrate
npx sequelize db:seed:all
```

`npm run dev` or `npm run start`

## Directory Structure

- controllers
- database:
  - migrations
  - models
  - seeders
- docs
- helpers
- middleware
- routes
- storage

## Config.js

```javascript
module.exports = {
  global: {
    test: 123
  },
  server: {
    multiProcessing: false, // default
    port: process.env.PORT ?? 5000 // default
  },
  // Add your module aliases so they are always at hand
  moduleAlias: {
    '@some-folder': __dirname + '/directory/some-folder'
  },
  middleware: {
    rateLimit: {
      windowMs: 5 * 60 * 1000, // default
      max: 1000 // default
    },
    cors: {}, // default
    validator: {
      locale: 'en' // default: en || ru
    },
    router: {
      baseUrl: '/', // default
      routesPath: '/routes', // default
      apiDocs: {
        title: 'API-docs' // default
      }
    },
    // Add your global middleware
    extend: () => [require('@middleware/global/some'), ...]
  },
  master(config) {
    console.log('I am working in the wizard when multiprocessing is running')
  },
  init(config) {
    // Will be executed before launching the application

    console.log('Hi, I am an initialization function')
  },
  start({ config, app, server }) {
    // Will be executed when the application starts

    // Calling a global variable
    console.log('Hello!', $test) // Hello 123
  }
}
```
