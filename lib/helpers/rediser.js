const redis = require('@risecorejs/redis')()
const models = require('@risecorejs/core/models')

/**
 * REDISER
 * @param key {string}
 * @param model {string|{
 *   name: string,
 *   method: string?,
 *   options: Object?
 * }}
 * @param options {{
 *   defaultValue: Function?
 * }?}
 * @return {Promise<any>}
 */
module.exports = async (key, model, options = {}) => {
  if (typeof model === 'string') {
    model = {
      name: model,
      method: 'findOne',
      options: {}
    }
  } else {
    model = {
      name: model.name,
      method: model.method || 'findOne',
      options: model.options || {}
    }
  }

  const redisData = await redis.get(key)

  if (redisData) {
    return JSON.parse(redisData)
  } else {
    const Model = models[model.name]

    const dbData = await Model[model.method](model.options)

    await redis.set(key, JSON.stringify(dbData))

    if ((!dbData || !dbData.length) && options.defaultValue) {
      return await options.defaultValue()
    }

    return dbData
  }
}
