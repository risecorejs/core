"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(config) {
    const route = getRoute();
    if (Array.isArray(config.router)) {
        for (const item of config.router) {
            if (item.main) {
                if (item.routes) {
                    item.routes.push(route);
                }
                else {
                    item.routes = [route];
                }
                break;
            }
        }
    }
    else {
        if (config.router.routes) {
            config.router.routes.push(route);
        }
        else {
            config.router.routes = [route];
        }
    }
}
exports.default = default_1;
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
    };
}
// INDEX-CONTROLLER
function indexController(req, res) {
    try {
        if (req.query.keys?.length) {
            const structs = {};
            for (const key of req.query.keys) {
                if ($structs[key]) {
                    structs[key] = $structs[key];
                }
            }
            return res.json({ structs });
        }
        else {
            return res.json({ structs: $structs });
        }
    }
    catch (err) {
        return {
            status: 500,
            message: err.message
        };
    }
}
// GET-DOCS
function getDocs() {
    return {
        description: 'Show all structs or show structs by keys: ' + Object.keys($structs).join(', '),
        params: {
            'keys[]': {
                value: 'key1'
            },
            keys: {
                value: 'key2'
            }
        }
    };
}
