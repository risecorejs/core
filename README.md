# Risecorejs - The Node.js Framework

## Setup

```sh
npm install -g @risecorejs/core
npm install -g nodemon

npx risecorejs init my-project

cd my-project

npm install

# One of the following:
npm install pg pg-hstore # Postgres
npm install mysql2 # MySQL
```

> Note: Don't forget to set up your database for the next step!

Copy ".env.example" -> ".env" and set up the #DATABASE section.

To run the application, use the following commands:

`npm run dev` or `npm run start`

## CLI

```sh
npx risecorejs --help
```

```
risecorejs <command> [options]

Commands:
  risecorejs init [folder]                                                    Init Risecorejs template
  risecorejs dev [port] [host] [multiprocessing] [multiprocessingWorkers]     Run server in live-reload mode
  risecorejs start [port] [host] [multiprocessing] [multiprocessingWorkers]   Run server
  risecorejs make:controller [entityName] [entityExtendedName]                Creating a base controller
  risecorejs make:model [entityName]                                          Creating a base model
  risecorejs make:docs [entityName] [entityExtendedName]                      Creating a base docs
  risecorejs make:routes [entityExtendedName]                                 Creating a base routes
  risecorejs make:entity [entityName] [entityExtendedName]                    Creating a base entity
  risecorejs make:migrations                                                  Automatic creation of migrations    

Options:
      --help     Show help                                                    [boolean]
  -v, --version  Show version number                                          [boolean]
```

## Directory structure

- controllers
- database:
  - joins
  - migrations
  - models
  - order-by
  - seeders
- docs
- middleware
- routes
- storage
- structs

## Config.js

```typescript
import { IConfig } from '@risecorejs/core/interfaces'

export default <IConfig>{
  global: {
    test: 123
  },

  server: {
    host: '0.0.0.0', // default: 'localhost'
    port: 5000, // default
    multiprocessing: true, // default: undefined (if:true ? mode:multiprocessing : mode:singleProcess)
    multiprocessingWorkers: 3, // default: undefined
  },

  // Add your module aliases so they are always at hand
  moduleAliases: {
    '~': __dirname,
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
    locale: 'ru' // default: 'en'
  },

  router: {
    baseUrl: '/', // default
    routesDir: '/', // default
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
      require('~/middleware/global/some-middleware') // or require('./middleware/global/some-middleware')
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
    console.log('Hello!', $.test) // Hello 123
  }
}
```
