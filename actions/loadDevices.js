const {
  LOAD_DEVICES,
  LOAD_DEVICES_SUCCESS,
  LOAD_DEVICES_ERROR
} = require('./actionTypes')

const apiClient = require('../config/apiClient')

function loadDevicesStart() {
  return {
    type: LOAD_DEVICES
  }
}
function loadDevicesSuccess(devices) {
  return {
    type: LOAD_DEVICES_SUCCESS,
    devices: devices
  }
}
function loadDevicesError(error) {
  return {
    type: LOAD_DEVICES_ERROR,
    error: error
  }
}

function loadDevices() {
  return function (dispatch) {

    dispatch(loadDevicesStart())

    return apiClient.getDevices()
      .then(devices => dispatch(loadDevicesSuccess(devices)))
      .catch(error => dispatch(loadDevicesError(error)))
  }
}

module.exports = {
  loadDevices,
  loadDevicesStart,
  loadDevicesSuccess,
  loadDevicesError
}
