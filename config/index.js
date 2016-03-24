import defaults from 'defaults'

const DEFAULTS = {
  env: 'development',
  port: 3000
}

const backend = process.env.BACKEND == 'mock'
  ? require('telldus-ws/build/backend-mock.js') // eslint-disable-line import/no-commonjs
  : require('telldus-ws/build/backend-telldus.js') // eslint-disable-line import/no-commonjs

export default defaults({
  house: 'Bjørges Leilighet',
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  debug: process.env.DEBUG,
  backend
}, DEFAULTS)
