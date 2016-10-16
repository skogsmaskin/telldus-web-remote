import cluster from 'cluster'
import http from 'http'
import app from '../app'
import config from '../config'
import os from 'os'

const pkg = require('../package') // eslint-disable-line import/no-commonjs

const numCPUs = os.cpus().length

if (cluster.isMaster) {
  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`) // eslint-disable-line no-console
  })

} else {
  const server = http.createServer(app)
  server.listen(config.port, () => {
    const host = server.address().address
    const port = server.address().port
    console.log('Worker / %s listening at http://%s:%s', pkg.name, host, port) // eslint-disable-line no-console
  })
}
