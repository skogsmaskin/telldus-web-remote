import request from './http'
import {memoize} from 'lodash'

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


export default function (config) {

  const {baseUrl} = config

  let es
  const events = () => {
    if (!es) {
      es = new EventSource(urlTo('/api/events'))
    }
    return es
  }
  //const events = memoize(() => ))

  return {
    togglePower(deviceId, turnOn) {
      return post(urlTo(`/api/devices/${deviceId}/command`), {command: turnOn ? 'turnOn' : 'turnOff'})
    },

    getDevices() {
      return get(urlTo('/api/devices'))
    },

    getSensors() {
      return get(urlTo('/api/sensors'))
    },

    turnOn(deviceId) {
      return this.togglePower(deviceId, true)
    },

    turnOff(deviceId) {
      return this.togglePower(deviceId, false)
    },

    dim(deviceId, dimlevel) {
      return post(urlTo(`/api/devices/${deviceId}/command`), {command: 'dim', arguments: [dimlevel]})
    },

    addSensorListener(listener) {
      const wrappedListener = event => listener(JSON.parse(event.data))
      events().addEventListener('sensor', wrappedListener)
      return () => events.removeEventListener('sensor', wrappedListener)
    },
    addDeviceListener(listener) {
      const wrappedListener = event => listener(JSON.parse(event.data))
      events().addEventListener('device', wrappedListener)
      return () => events.removeEventListener('device', wrappedListener)
    }
  }
  function urlTo(endpoint) {
    return `${baseUrl}${endpoint}`
  }
}
