import {Server as WebSocketServer} from 'ws'

import {deviceEvents} from './lib/backend/telldus'

export default function mount(server) {
  var io = require('socket.io')(server)
  io.on('connection', function (socket) {
    const subscription = deviceEvents.subscribe(event => {
      socket.send(JSON.stringify(event))
    })
    socket.on('disconnect', () => {
      subscription.dispose()
    })
  })
}
