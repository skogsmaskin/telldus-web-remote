const devices = require('./devices')
const sensorEvents = require('./sensor-events')
const update = require('update-object')

function defer(ms, resolver) {
  return new Promise(resolve => {
    setTimeout(() => {
      Promise.resolve().then(resolver).then(resolve)
    }, ms)
  })
}

function _dim(device, dimlevel) {
  return update(device, {
    state: {
      $merge: {
        on: true,
        dimmed: true,
        dimlevel: dimlevel
      }
    }
  })
}

function _turnOn(device) {
  return update(device, {
    state: {
      $merge: {
        on: true,
        dimmed: device.dimmable
      }
    }
  })
}

function _turnOff(device) {
  return update(device, {
    state: {
      $merge: {
        on: false,
        dimmed: false
      }
    }
  })
}

function _updateDevice(id, fn) {
  return defer(200, () => {
    const idx = devices.findIndex(dev => dev.id == id)
    devices[idx] = fn(devices[idx])
    return devices[idx]
  })
}


module.exports = function () {
  return {
    getDevices() {
      return defer(Math.floor(Math.random() * 1000), () => devices)
    },

    getSensors() {
      return defer(100, () => sensorEvents.map(ev => ev.device))
    },

    togglePower(deviceId, turnOn) {
      return _updateDevice(deviceId, turnOn ? _turnOff : _turnOn)
    },

    turnOn(deviceId) {
      return _updateDevice(deviceId, _turnOn)
    },

    turnOff(deviceId) {
      return _updateDevice(deviceId, _turnOff)
    },

    dim(deviceId, dimlevel) {
      return _updateDevice(deviceId, device => {
        if (!device.dimmable) {
          throw new Error(`Tried to dim the non-dimmable device ${device.name} (#${device.id})`)
        }
        return defer(1000, () => _dim(device, dimlevel))
      })
    }
  }
}
