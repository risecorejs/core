module.exports = (key, defaultValue) => process.env[key] ?? defaultValue ?? null
