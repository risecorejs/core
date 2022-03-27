module.exports = (variables) => {
  for (const [key, value] of Object.entries(variables)) {
    global['$' + key] = value
  }
}
