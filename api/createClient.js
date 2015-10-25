module.exports = function createClient(backendImpl) {

  return {
    togglePower(deviceId, turnOn) {
      return backendImpl.togglePower(deviceId, turnOn)
    },

    getDevices() {
      return backendImpl.getDevices()
    },

    getSensors() {
      return backendImpl.getSensors()
    },

    turnOn(deviceId) {
      return backendImpl.turnOn(deviceId)
    },

    turnOff(deviceId) {
      return backendImpl.turnOff(deviceId)
    },

    dim(deviceId, dimlevel) {
      return backendImpl.dim(deviceId, dimlevel)
    }
  }
}
