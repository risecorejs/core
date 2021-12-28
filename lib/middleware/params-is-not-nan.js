module.exports = (key) => (req, res, next) => {
  if (isNaN(+req.params[key])) {
    return res.sendStatus(400)
  }

  next()
}
