module.exports = (...roles) => {
  if (Array.isArray(roles[0])) {
    roles = roles[0]
  }

  return (req, res, next) => {
    if (roles.includes(req.me.role)) {
      next()
    } else {
      return res.sendStatus(403)
    }
  }
}
