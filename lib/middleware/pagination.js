module.exports = (req, res, next) => {
  const page = +req.query.page || 1
  const pageSize = +req.query.pageSize || 25

  if (isNaN(page) || page < 0 || isNaN(pageSize) || pageSize < 0) {
    return res.sendStatus(400)
  }

  req.pagination = () => ({
    offset: (page - 1) * pageSize,
    limit: pageSize
  })

  next()
}
