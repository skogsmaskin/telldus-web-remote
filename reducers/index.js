import {combineReducers} from 'redux'
import update from 'update-object'

import {
  LOAD_SENSORS,
  LOAD_SENSORS_SUCCESS,
  LOAD_SENSORS_FAILURE,
  RECEIVE_SENSOR_EVENT,
  RECEIVE_DEVICE_EVENT,

  LOAD_DEVICES,
  LOAD_DEVICES_SUCCESS,
  LOAD_DEVICES_FAILURE,

  DEVICE_COMMAND,
  DEVICE_COMMAND_SUCCESS,
  DEVICE_COMMAND_FAILURE
} from '../actions/actionTypes'

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
          return Object.assign({}, item, {
            _pendingState: null,
            state: action.deviceState
          })
        })
      })
    case DEVICE_COMMAND_FAILURE:
      return state
    case RECEIVE_DEVICE_EVENT:
      return Object.assign({}, state, {
        items: state.items.map(item => {
          if (item.id !== action.event.deviceId) {
            return item
          }
          switch (action.event.type) {
            case 'statechange':
              return Object.assign({}, item, {
                state: action.event.state,
                _pendingState: null
              })
            case 'change':
              return action.event.device
            default:
              return item
          }
        })
      })
    default:
      return state
  }
}

function updateSensorData(sensor, sensorEvent) {
  return update(sensor, {
    data: {
      [sensorEvent.type]: {
        $set: {
          value: sensorEvent.value,
          timestamp: sensorEvent.timestamp
        }
      }
    }
  })
}

function sensors(state = {items: []}, action) {
  switch (action.type) {
    case LOAD_SENSORS:
      return {status: 'loading', items: []}
    case LOAD_SENSORS_SUCCESS:
      return {status: 'success', items: action.sensors}
    case LOAD_SENSORS_FAILURE:
      return {status: 'error', error: action.error}
    case RECEIVE_SENSOR_EVENT:
      return Object.assign({}, state, {
        items: state.items.map(item => {
          if (item.id !== action.event.sensorId) {
            return item
          }
          return updateSensorData(item, action.event)
        })
      })

    default:
      return state
  }
}

export default combineReducers({
  devices,
  sensors
})
