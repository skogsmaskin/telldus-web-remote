import request from "./request";

function post(url, data) {
  return request(url, {method: 'POST', body: data}).then((response)=> {
    if (response.status < 200 || response.status > 299) {
      throw new Error(`Invalid response ${response.status}: ${response.body}`);
    }
    return response.body;
  });
}

module.exports = {

  togglePower(deviceId, turnOn) {
    return post(`/api/devices/${deviceId}/command`, {name: turnOn ? 'turnOn' : 'turnOff'})
  },

  getDevices() {
    return get("/api/devices")
  },

  getSensors() {
    return get("/api/sensors")
  },

  turnOn(deviceId) {
    return this.togglePower(deviceId, true);
  },

  turnOff(deviceId) {
    return this.togglePower(deviceId, false);
  },

  dim(deviceId, dimlevel) {
    return post(`/api/devices/${deviceId}/command`, {name: 'dim', arguments: [dimlevel]})
  }
};