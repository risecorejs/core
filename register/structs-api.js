module.exports = (config) => {
  const route = getRoute()

  if (Array.isArray(config.middleware.router)) {
    for (const routerConfig of config.middleware.router) {
      if (routerConfig.main) {
        if (routerConfig.routes) {
          routerConfig.routes.push(route)
        } else {
          routerConfig.routes = [route]
        }

        break
      }
    }
  } else {
    if (config.middleware.router.routes) {
      config.middleware.router.routes.push(route)
    } else {
      config.middleware.router.routes = [route]
    }
  }
}

// GET-ROUTE
function getRoute() {
  return {
    group: 'Structs',
    url: '/__structs',
    children: [
      {
        method: 'GET',
        url: '/',
        controller: indexController,
        docs: getDocs()
      }
    ]
  }
}

// INDEX-CONTROLLER
function indexController(req, res) {
  try {
    if (req.query.codes?.length) {
      const structs = {}

      for (const code of req.query.codes) {
        if ($structs[code]) {
          structs[code] = $structs[code]
        }
      }

      return res.json({ structs })
    } else {
      return res.json({ structs: $structs })
    }
  } catch (err) {
    return {
      status: 500,
      message: err.message
    }
  }
}

// GET-DOCS
function getDocs() {
  return {
    description: 'Show all structs or show structs by codes: ' + Object.keys($structs).join(', '),
    params: {
      'codes[]': {
        value: 'code1'
      },
      codes: {
        value: 'code2'
      }
    }
  }
}
