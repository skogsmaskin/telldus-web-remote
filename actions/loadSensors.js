//{ type: 'FETCH_POSTS' }
//{ type: 'FETCH_POSTS', status: 'error', error: 'Oops' }
//{ type: 'FETCH_POSTS', status: 'success', response: { ... } }
const {LOAD_SENSORS, LOAD_SENSORS_SUCCESS, LOAD_SENSORS_ERROR, RECEIVE_SENSOR_UPDATE} = require('./actionTypes')
const apiClient = require('../config/apiClient')

function loadSensorsStart() {
  return {
    type: LOAD_SENSORS
  }
}
function loadSensorsSuccess(sensors) {
  return {
    type: LOAD_SENSORS_SUCCESS,
    sensors: sensors
  }
}
function loadSensorsError(error) {
  return {
    type: LOAD_SENSORS_ERROR,
    error: error
  }
}

function loadSensors() {
  return function (dispatch) {

    dispatch(loadSensorsStart())

    return apiClient.getSensors()
      .then(sensors => dispatch(loadSensorsSuccess(sensors)))
      .catch(error => dispatch(loadSensorsError(error)))
  }
}

module.exports = {
  loadSensors,
  loadSensorsStart,
  loadSensorsSuccess,
  loadSensorsError
}
