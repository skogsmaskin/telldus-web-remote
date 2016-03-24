import {
  LOAD_DEVICES,
  LOAD_DEVICES_SUCCESS,
  LOAD_DEVICES_FAILURE
} from './actionTypes'

import apiClient from '../config/apiClient'

export function loadDevicesStart() {
  return {
    type: LOAD_DEVICES
  }
}
export function loadDevicesSuccess(devices) {
  return {
    type: LOAD_DEVICES_SUCCESS,
    devices: devices
  }
}
export function loadDevicesError(error) {
  return {
    type: LOAD_DEVICES_FAILURE,
    error: error
  }
}

export function loadDevices() {
  return function (dispatch) {

    dispatch(loadDevicesStart())

    return apiClient.getDevices()
      .then(devices => dispatch(loadDevicesSuccess(devices)))
      .catch(error => dispatch(loadDevicesError(error)))
  }
}
