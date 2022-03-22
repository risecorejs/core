const models = require('@risecorejs/core/models')

const crud = { create, index, show, update, destroy }

/**
 * CRUD-BUILDER
 * @param options {{
 *   Model: Object|string,
 *   endpoints: Object
 * }}
 * @return {{ create: create?, index: index?, show: show?, update: update? }}
 */
module.exports = (options) => {
  /**
   * endpoints
   * @type {{ create: create?, index: index?, show: show?, update: update? }}
   */
  const endpoints = {}

  const Model = getModel(options.Model)

  for (const endpoint in options.endpoints) {
    endpoints[endpoint] = crud[endpoint](options.endpoints[endpoint], Model)
  }

  return endpoints
}

/**
 * CREATE
 * @param options {{
 *   Model: Object|string?,
 *   state: Object?,
 *   validator: boolean?,
 *   rules: Object,
 *   fields: Array|string,
 *   formatter: Function?,
 *   beforeCreate: Function?,
 *   afterCreate: Function?,
 *   response: Function?
 * }|true}
 * @param Model {Object}
 * @return {Function}
 */
function create(options, Model) {
  return async (req, res) => {
    try {
      if (options === true) options = {}

      const context = {
        req,
        state: options.state || {},
        fields: null,
        instance: null
      }

      if (options.Model) {
        Model = getModel(options.Model)
      }

      if (options.validator !== false && options.rules) {
        if (typeof options.rules === 'function') {
          options.rules = options.rules(context)
        }

        const errors = await req.validator(options.rules)

        if (errors) {
          return res.status(400).json({ errors })
        }
      }

      if (typeof options.fields === 'function') {
        options.fields = options.fields(context)
      }

      context.fields = options.fields ? req.only(options.fields) : req.body

      if (options.formatter) {
        await options.formatter(context)
      }

      if (options.beforeCreate) {
        await options.beforeCreate(context)
      }

      context.instance = await Model.create(context.fields)

      if (options.afterCreate) {
        await options.afterCreate(context)
      }

      if (options.response) {
        const response = await options.response(context)

        return res.status(201).json(response)
      }

      return res.status(201).json(instance)
    } catch (err) {
      return res.sendStatus(err.status || err.response?.status || 500)
    }
  }
}

/**
 * INDEX
 * @param options {{
 *   Model: Object|string?,
 *   method: "findAndCountAll"|"findAll"?,
 *   pagination: boolean?,
 *   queryBuilder: Function?,
 *   response: Function?
 * }|true}
 * @param Model {Object}
 * @return {Function}
 */
function index(options, Model) {
  return async (req, res) => {
    try {
      if (options === true) options = {}

      if (options.Model) {
        Model = getModel(options.Model)
      }

      options.method ||= 'findAndCountAll'

      const queryOptions = {
        order: [['id', 'DESC']]
      }

      if (options.method === 'findAndCountAll') {
        queryOptions.distinct = true
      }

      if (options.pagination !== false) {
        Object.assign(queryOptions, req.pagination())
      }

      if (options.queryBuilder) {
        Object.assign(queryOptions, await options.queryBuilder(req))
      }

      const instances = await Model[options.method](queryOptions)

      if (options.response) {
        const response = await options.response(instances, req)

        return res.json(response)
      }

      return res.json(instances)
    } catch (err) {
      return res.sendStatus(err.status || err.response?.status || 500)
    }
  }
}

/**
 * SHOW
 * @param options {{
 *   Model: Object|string?,
 *   key: "id" | string?,
 *   queryBuilder: Function?,
 *   response: Function?
 * }|true}
 * @param Model {Object}
 * @return {Function}
 */
function show(options, Model) {
  return async (req, res) => {
    try {
      if (options === true) options = {}

      if (options.Model) {
        Model = getModel(options.Model)
      }

      const queryOptions = {
        where: {}
      }

      if (options.key !== false) {
        options.key ||= 'id'

        queryOptions.where[options.key] = req.params[options.key]
      }

      if (options.queryBuilder) {
        const _queryOptions = await options.queryBuilder(req)

        if (_queryOptions.where) {
          Object.assign(queryOptions.where, _queryOptions.where)
        }

        delete _queryOptions.where

        Object.assign(queryOptions, _queryOptions)
      }

      const instance = await Model.findOne(queryOptions)

      if (!instance) {
        return res.sendStatus(404)
      }

      if (options.response) {
        const response = await options.response(instance, req)

        return res.json(response)
      }

      return res.json(instance)
    } catch (err) {
      return res.sendStatus(err.status || err.response?.status || 500)
    }
  }
}

/**
 * UPDATE
 * @param options {{
 *   Model: Object|string?,
 *   state: Object?,
 *   key: "id" | string?,
 *   queryBuilder: Function?,
 *   validator: boolean?,
 *   rules: Function,
 *   fields: Array|string,
 *   formatter: Function?,
 *   beforeUpdate: Function?,
 *   afterUpdate: Function?,
 *   response: Function?
 * }|true}
 * @param Model {Object}
 * @return {Function}
 */
function update(options, Model) {
  return async (req, res) => {
    try {
      if (options === true) options = {}

      const context = {
        req,
        state: options.state || {},
        fields: null,
        instance: null
      }

      if (options.Model) {
        Model = getModel(options.Model)
      }

      const queryOptions = {
        where: {}
      }

      if (options.key !== false) {
        options.key ||= 'id'

        queryOptions.where[options.key] = req.params[options.key]
      }

      if (options.queryBuilder) {
        const _queryOptions = await options.queryBuilder(req, context.state)

        if (_queryOptions.where) {
          Object.assign(queryOptions.where, _queryOptions.where)
        }

        delete _queryOptions.where

        Object.assign(queryOptions, _queryOptions)
      }

      context.instance = await Model.findOne(queryOptions)

      if (!context.instance) {
        return res.sendStatus(404)
      }

      if (options.validator !== false && options.rules) {
        if (typeof options.rules === 'function') {
          options.rules = options.rules(context)
        }

        const errors = await req.validator(options.rules)

        if (errors) {
          return res.status(400).json({ errors })
        }
      }

      if (typeof options.fields === 'function') {
        options.fields = options.fields(context)
      }

      context.fields = options.fields ? req.only(options.fields) : req.body

      if (options.formatter) {
        await options.formatter(context)
      }

      if (options.beforeUpdate) {
        await options.beforeUpdate(context)
      }

      await context.instance.update(context.fields)

      if (options.afterUpdate) {
        await options.afterUpdate(context)
      }

      if (options.response) {
        const response = await options.response(context)

        return res.json(response)
      }

      return res.json(context.instance)
    } catch (err) {
      return res.sendStatus(err.status || err.response?.status || 500)
    }
  }
}

/**
 * DESTROY
 * @param options {{
 *   Model: Object|string?,
 *   key: "id" | string?,
 *   queryBuilder: Function?,
 *   force: boolean?,
 *   beforeDestroy: Function?,
 *   afterDestroy: Function?,
 *   response: Function?
 * }|true}
 * @param Model {Object}
 * @return {Function}
 */
function destroy(options, Model) {
  return async (req, res) => {
    try {
      if (options === true) options = {}

      if (options.Model) {
        Model = getModel(options.Model)
      }

      const queryOptions = {
        where: {}
      }

      if (options.key !== false) {
        options.key ||= 'id'

        queryOptions.where[options.key] = req.params[options.key]
      }

      if (options.queryBuilder) {
        const _queryOptions = await options.queryBuilder(req)

        if (_queryOptions.where) {
          Object.assign(queryOptions.where, _queryOptions.where)
        }

        delete _queryOptions.where

        Object.assign(queryOptions, _queryOptions)
      }

      const instance = await Model.findOne(queryOptions)

      if (!instance) {
        return res.sendStatus(404)
      }

      const destroyOptions = {}

      if (options.force) {
        if (typeof options.force === 'function') {
          destroyOptions.force = await options.force(req)
        } else {
          destroyOptions.force = true
        }
      }

      if (options.beforeDestroy) {
        await options.beforeDestroy(instance, req)
      }

      await instance.destroy(destroyOptions)

      if (options.afterDestroy) {
        await options.afterDestroy(instance, req)
      }

      if (options.response) {
        const response = await options.response(instance, req)

        return res.json(response)
      }

      return res.json(instance)
    } catch (err) {
      return res.sendStatus(err.status || err.response?.status || 500)
    }
  }
}

/**
 * GET-MODEL
 * @param Model {Object|string}
 * @return {Object}
 */
function getModel(Model) {
  return typeof Model === 'string' ? models[Model] : Model
}
