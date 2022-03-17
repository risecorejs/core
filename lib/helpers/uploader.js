const multer = require('multer')

/**
 * UPLOADER
 * @param req {object}
 * @param res {object}
 * @param options {{
 *  method: 'single'|'array'|'fields'|'none'|'any'?,
 *  args: any[]?,
 *  storage: {
 *   dist: string?,
 *   type: 'diskStorage'|'memoryStorage'?
 *  }?,
 *  settings: {
 *    maxSize: number?,
 *    extensions: string[]?
 *  }?
 * }?}
 * @return {Promise<any>}
 */
module.exports = async (req, res, options = {}) => {
  options.method ||= 'any'
  options.args ||= []
  options.storage ||= {
    type: 'memoryStorage'
  }

  const Multer = await multer({
    get storage() {
      switch (options.storage.type) {
        case 'memoryStorage':
          return multer.memoryStorage()

        case 'diskStorage':
          return multer.diskStorage({
            destination: function (req, file, cb) {
              cb(null, options.storage.dist)
            },
            filename: function (req, file, cb) {
              cb(null, Date.now() + '-' + file.originalname)
            }
          })
      }
    },
    limits: {
      fileSize: options.settings?.maxSize ? 1024 * 1024 * options.settings.maxSize : Infinity
    },
    fileFilter(req, file, cb) {
      if (options.settings?.extensions) {
        const regex = new RegExp(options.settings.extensions.join('|'), 'i')

        if (!file.originalname.match(regex)) {
          cb(Error('wrong_format'))
        }
      }

      cb(null, true)
    }
  })

  const upload = Multer[options.method](...options.args)

  return new Promise((resolve, reject) => {
    upload(req, res, (err) => {
      if (err) {
        reject(err)
      } else {
        const data = req[options.method === 'single' ? 'file' : 'files']

        resolve(options.storage.type === 'memoryStorage' ? data.buffer : data)
      }
    })
  })
}
