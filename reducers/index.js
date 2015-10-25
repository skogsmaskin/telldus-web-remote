const {combineReducers} = require('redux')

const {
  LOAD_SENSORS,
  LOAD_SENSORS_SUCCESS,
  LOAD_SENSORS_FAILURE,
  RECEIVE_SENSOR_UPDATE,

  LOAD_DEVICES,
  LOAD_DEVICES_SUCCESS,
  LOAD_DEVICES_FAILURE,

  DEVICE_COMMAND,
  DEVICE_COMMAND_SUCCESS,
  DEVICE_COMMAND_FAILURE
} = require('../actions/actionTypes')

function getPendingState(device, command) {
  switch (command.name) {
    case 'turnOn':
      return {
        on: true,
        dimmed: device.dimmable,
        dimlevel: device.state.dimlevel
      }
    case 'turnOff':
      return {
        on: false,
        dimmed: false,
        dimlevel: device.state.dimlevel
      }
    case 'dim':
      return {
        on: true,
        dimmed: true,
        dimlevel: command.dimlevel
      }
    default:
      throw new Error(`Invalid device command ${command}`)
  }
}

function devices(state = {items: []}, action) {
  switch (action.type) {
    case LOAD_DEVICES:
      return {status: 'loading', items: []}
    case LOAD_DEVICES_SUCCESS:
      return {status: 'success', items: action.devices}
    case LOAD_DEVICES_FAILURE:
      return {status: 'error', error: action.error}
    case DEVICE_COMMAND:
      return Object.assign({}, state, {
        items: state.items.map(item => {
          if (item.id !== action.deviceId) {
            return item
          }
          return Object.assign({}, item, {
            _pendingState: getPendingState(item, action.command)
          })
        })
      })
    case DEVICE_COMMAND_SUCCESS:
      return Object.assign({}, state, {
        items: state.items.map(item => {
          if (item.id !== action.deviceId) {
            return item
          }
          return action.device
        })
      })
    case DEVICE_COMMAND_FAILURE:
      return state
    default:
      return state
  }
}


function sensors(state = {items: []}, action) {
  switch (action.type) {
    case LOAD_SENSORS:
      return {status: 'loading', items: []}
    case LOAD_SENSORS_SUCCESS:
      return {status: 'success', items: action.sensors}
    case LOAD_SENSORS_FAILURE:
      return {status: 'error', error: action.error}
    case RECEIVE_SENSOR_UPDATE:
      return Object.assign({}, state, {
        items: state.items.map(item => {
          if (item.id !== action.deviceId) {
            return item
          }
          return action.sensor
        })
      })
    default:
      return state
  }
}

module.exports = combineReducers({
  devices,
  sensors
})
