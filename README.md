# Risecorejs - The Node.js Framework

## Setup

```sh
npm install -g @risecorejs/core
npm install -g nodemon

risecorejs init my-project

cd my-project

npm install
```

> Note: Don't forget to set up your database for the next step!

```sh
npx sequelize db:migrate
npx sequelize db:seed:all
```

Copy ".env.example" -> ".env" and add your private key to JWT_SECRET_KEY etc.

`npm run dev` or `npm run start`

## Directory structure

- controllers
- database:
  - migrations
  - models
  - seeders
- docs
- middleware
- routes
- storage
- structs

## Config.js

```javascript
module.exports = {
  global: {
    test: 123
  },
  
  server: {
    host: 'localhost', // default | ('localhost' || '0.0.0.0')
    port: 8000, // default
    multiProcessing: false, // default | if:true ? mode:multiProcessing : mode:singleProcess
    multiProcessingWorkers: null, // default
  },
  
  // Add your module aliases so they are always at hand
  moduleAlias: {
    '@some-folder': __dirname + '/directory/some-folder'
  },
  
  storage: true, // default
  
  structs: {
    setGlobal: true, // default
    enableAPI: true, // default,
    dir: __dirname + '/structs' // default
  },
  
  cron: {
    childProcess: true, // if:true ? mode:childProcess : mode:inside
    jobs: {
      '0 0 * * * *'() {
        console.log(123)
      }
    }
  },
  
  processes: {
    notifications: {
      vars: {
        filePath: __dirname + '/processes/notifications.js',
        notificationWorkers: env('NOTIFICATION_WORKERS', 3)
      },
      dev: {
        cmd: 'node {{ filePath }}'
      },
      prod: {
        cmd: 'pm2 start {{ filePath }} -i {{ notificationWorkers }}',
        await: true
      },
      default: {
        cmd: 'node {{ filePath }}'
      }
    }
  },
  
  validator: {
    locale: 'en' // default
  },
  
  router: {
    baseUrl: '/', // default
    routesPath: '/routes', // default
    apiDocs: {
      title: 'API-docs' // default
    }
  },
  
  middleware: {
    // docs: https://www.npmjs.com/package/express-rate-limit
    rateLimit: {
      windowMs: 5 * 60 * 1000, // default
      max: 1000 // default 
    },
    
    // docs: https://www.npmjs.com/package/cors#configuring-cors
    cors: {}, // default
    
    // Add your global middleware
    extend: () => [
      require('~/middleware/global/some-middleware'),
      // require('../middleware/global/some-middleware')
    ]
  },
  
  init(config) {
    // Will be executed before launching the application

    console.log('Hi, I am an initialization function')
  },
  
  master(config) {
    console.log('I am working in the wizard when multiprocessing is running')
  },
  
  start({ config, app, server }) {
    // Will be executed when the application starts

    // Calling a global variable
    console.log('Hello!', $test) // Hello 123
  }
}
```
