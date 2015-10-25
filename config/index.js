var defaults = require('defaults')

var DEFAULTS = {
  env: 'development',
  port: 3000
}

module.exports = defaults({
  house: 'Bjørges Leilighet',
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  debug: process.env.DEBUG
}, DEFAULTS)
