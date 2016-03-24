import defaults from 'defaults'

const DEFAULTS = {
  env: 'development',
  port: 3000
}

export default defaults({
  house: 'Bjørges Leilighet',
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  debug: process.env.DEBUG
}, DEFAULTS)
