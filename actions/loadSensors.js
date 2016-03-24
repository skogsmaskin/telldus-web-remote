import {
  LOAD_SENSORS,
  LOAD_SENSORS_SUCCESS,
  LOAD_SENSORS_FAILURE,
  //RECEIVE_SENSOR_UPDATE
} from './actionTypes'

import apiClient from '../config/apiClient'

export function loadSensorsStart() {
  return {
    type: LOAD_SENSORS
  }
}
export function loadSensorsSuccess(sensors) {
  return {
    type: LOAD_SENSORS_SUCCESS,
    sensors: sensors
  }
}
export function loadSensorsError(error) {
  return {
    type: LOAD_SENSORS_FAILURE,
    error: error
  }
}

export function loadSensors() {
  return function (dispatch) {

    dispatch(loadSensorsStart())

    return apiClient.getSensors()
      .then(sensors => dispatch(loadSensorsSuccess(sensors)))
      .catch(error => dispatch(loadSensorsError(error)))
  }
}
