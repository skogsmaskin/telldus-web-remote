//{ type: 'FETCH_POSTS' }
//{ type: 'FETCH_POSTS', status: 'error', error: 'Oops' }
//{ type: 'FETCH_POSTS', status: 'success', response: { ... } }
import {DEVICE_COMMAND, DEVICE_COMMAND_FAILURE, DEVICE_COMMAND_SUCCESS} from './actionTypes'
import apiClient from '../config/apiClient'
import latest from 'promise-latest'
import debounce from 'debounce-promise'

function sendCommandStart(deviceId, command) {
  return {
    type: DEVICE_COMMAND,
    deviceId,
    command
  }
}
function sendCommandSuccess(deviceId, command, newDeviceState) {
  return {
    type: DEVICE_COMMAND_SUCCESS,
    deviceId,
    command,
    deviceState: newDeviceState
  }
}

function sendCommandError(deviceId, command, error) {
  return {
    type: DEVICE_COMMAND_FAILURE,
    deviceId,
    command,
    device: error
  }
}

const dimFns = {}
function dimmerFor(deviceId) {
  if (dimFns[deviceId]) {
    return dimFns[deviceId]
  }
  const dimmer = latest(debounce(dimlevel => apiClient.dim(deviceId, dimlevel), 1000))
  dimFns[deviceId] = dimmer
  return dimmer
}

function sendCommand(deviceId, command) {
  switch (command.name) {
    case 'turnOn':
      return apiClient.turnOn(deviceId)
    case 'turnOff':
      return apiClient.turnOff(deviceId)
    case 'dim':
      return dimmerFor(deviceId)(command.dimlevel)
    default:
      throw new Error(`Invalid device command: ${command.name}`)
  }
}

export function sendDeviceCommand(deviceId, command) {

  return function (dispatch) {
    dispatch(sendCommandStart(deviceId, command))

    sendCommand(deviceId, command)
      .then(newDeviceState => dispatch(sendCommandSuccess(deviceId, command, newDeviceState)))
      .catch(error => dispatch(sendCommandError(deviceId, command, error)))

  }
}
