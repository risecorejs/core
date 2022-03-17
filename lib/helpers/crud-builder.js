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

  const Model = typeof options.Model === 'string' ? models[options.Model] : options.Model

  for (const endpoint in options.endpoints) {
    endpoints[endpoint] = crud[endpoint](options.endpoints[endpoint], Model)
  }

  return endpoints
}

/**
 * CREATE
 * @param options {{
 *   validator: boolean?,
 *   rules: Object,
 *   fields: Array,
 *   formatter: Function?,
 *   response: Function?
 * }}
 * @param Model {Object}
 * @return {Function}
 */
function create(options, Model) {
  return async (req, res) => {
    if (options.validator !== false && options.rules) {
      const errors = await req.validator(options.rules)

      if (errors) {
        return res.status(400).json({ errors })
      }
    }

    const data = options.fields ? req.only(options.fields) : req.body

    if (options.formatter) {
      await options.formatter(data)
    }

    const result = await Model.create(data)

    if (options.response) {
      const response = await options.response(result, req)

      return res.status(201).json(response)
    }

    return res.status(201).json(result)
  }
}

/**
 * INDEX
 * @param options {{
 *   method: "findAndCountAll" | "findAll"?,
 *   pagination: boolean?,
 *   queryBuilder: Function?,
 *   response: Function?
 * }}
 * @param Model {Object}
 * @return {Function}
 */
function index(options, Model) {
  return async (req, res) => {
    if (options === true) options = {}

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

    const result = await Model[options.method](queryOptions)

    if (options.response) {
      const response = await options.response(result, req)

      return res.json(response)
    }

    return res.json(result)
  }
}

/**
 * SHOW
 * @param options {{
 *   key: "id" | string?,
 *   queryBuilder: Function?,
 *   response: Function?
 * }}
 * @param Model {Object}
 * @return {Function}
 */
function show(options, Model) {
  return async (req, res) => {
    if (options === true) options = {}

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

    const result = await Model.findOne(queryOptions)

    if (!result) {
      return res.sendStatus(404)
    }

    if (options.response) {
      const response = await options.response(result, req)

      return res.json(response)
    }

    return res.json(result)
  }
}

/**
 * UPDATE
 * @param options {{
 *   key: "id" | string?,
 *   queryBuilder: Function?,
 *   validator: boolean?,
 *   rules: Function,
 *   fields: Array,
 *   formatter: Function?,
 *   response: Function?
 * }}
 * @param Model {Object}
 * @return {Function}
 */
function update(options, Model) {
  return async (req, res) => {
    if (options === true) options = {}

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

    const result = await Model.findOne(queryOptions)

    if (!result) {
      return res.sendStatus(404)
    }

    if (options.validator !== false && options.rules) {
      const errors = await req.validator(options.rules(result, req))

      if (errors) {
        return res.status(400).json({ errors })
      }
    }

    const data = options.fields ? req.only(options.fields) : req.body

    if (options.formatter) {
      await options.formatter(data)
    }

    await result.update(data)

    if (options.response) {
      const response = await options.response(result, req)

      return res.json(response)
    }

    return res.json(result)
  }
}

/**
 * DESTROY
 * @param options {{
 *   key: "id" | string?,
 *   queryBuilder: Function?,
 *   force: boolean?,
 *   response: Function?
 * }}
 * @param Model {Object}
 * @return {Function}
 */
function destroy(options, Model) {
  return async (req, res) => {
    if (options === true) options = {}

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

    const result = await Model.findOne(queryOptions)

    if (!result) {
      return res.sendStatus(404)
    }

    const destroyOptions = {}

    if (options.force === true) {
      destroyOptions.force = true
    }

    await result.destroy(destroyOptions)

    if (options.response) {
      const response = await options.response(result, req)

      return res.json(response)
    }

    return res.end()
  }
}
