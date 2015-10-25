import request from '../../lib/http'

function post(url, data) {
  return request(url, {method: 'POST', body: data}).then((response) => {
    if (response.status < 200 || response.status > 299) {
      throw new Error(`Invalid response ${response.status}: ${response.body}`)
    }
    return response.json()
  })
}
function get(url) {
  return request(url, {method: 'GET'}).then(response => {
    if (response.status < 200 || response.status > 299) {
      throw new Error(`Invalid response ${response.status}: ${response.body}`)
    }
    return response.json()
  })
}

module.exports = function (config) {

  const {baseUrl} = config

  function urlTo(endpoint) {
    return `${baseUrl}${endpoint}`
  }

  return {
    togglePower(deviceId, turnOn) {
      return post(urlTo(`/api/devices/${deviceId}/command`), {command: turnOn ? 'turnOn' : 'turnOff'})
    },

    getDevices() {
      return get(urlTo(`/api/devices`))
    },

    getSensors() {
      return get(urlTo(`/api/sensors`))
    },

    turnOn(deviceId) {
      return this.togglePower(deviceId, true)
    },

    turnOff(deviceId) {
      return this.togglePower(deviceId, false)
    },

    dim(deviceId, dimlevel) {
      return post(urlTo(`/api/devices/${deviceId}/command`), {command: 'dim', arguments: [dimlevel]})
    }
  }
}
