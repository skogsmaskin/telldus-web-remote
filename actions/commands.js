//{ type: 'FETCH_POSTS' }
//{ type: 'FETCH_POSTS', status: 'error', error: 'Oops' }
//{ type: 'FETCH_POSTS', status: 'success', response: { ... } }
const {DEVICE_COMMAND, DEVICE_COMMAND_ERROR, DEVICE_COMMAND_SUCCESS} = require('./actionTypes')
const apiClient = require('../config/apiClient')
const latest = require('promise-latest')
const debounce = require('debounce-promise')

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
    device: newDeviceState
  }
}

function sendCommandError(deviceId, command, error) {
  return {
    type: DEVICE_COMMAND_ERROR,
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

function sendDeviceCommand(deviceId, command) {

  return function (dispatch) {
    dispatch(sendCommandStart(deviceId, command))

    sendCommand(deviceId, command)
      .then(newDeviceState => dispatch(sendCommandSuccess(deviceId, command, newDeviceState)))
      .catch(error => dispatch(sendCommandError(deviceId, command, error)))

  }
}

module.exports = {
  sendDeviceCommand
}
