import React, {PropTypes} from'react'
import DeviceList from'./DeviceList'
import Device from'./Device'
import {connect} from'react-redux'
import config from '../config'
import {loadDevices} from'../actions/loadDevices'
import {loadSensors} from'../actions/loadSensors'
import {sendDeviceCommand} from'../actions/commands'
import SensorList from './SensorList'
import Header from './Header'
import CustomPropTypes from '../lib/PropTypes'

function setDevicePower(device, turnOn) {
  if (device.dimmable) {
    return {
      name: turnOn ? 'dim' : 'turnOff',
      dimlevel: turnOn ? 100 : 0
    }
  }
  return {
    name: turnOn ? 'turnOn' : 'turnOff',
  }
}

const App = React.createClass({
  displayName: 'App',
  propTypes: {
    sendDeviceCommand: PropTypes.func,
    devices: PropTypes.shape({
      status: PropTypes.oneOf(['success', 'error', 'pending']),
      items: PropTypes.arrayOf(CustomPropTypes.device)
    }),
    sensors: PropTypes.shape({
      status: PropTypes.oneOf(['success', 'error', 'pending']),
      items: PropTypes.arrayOf(CustomPropTypes.sensor)
    })
  },

  handleDeviceCommand(deviceId, command) {
    this.props.sendDeviceCommand(deviceId, command)
  },

  renderDevice(device) {
    return <Device device={device} onCommand={this.handleDeviceCommand}/>
  },

  toggleAll(on, e) {
    e.preventDefault()
    const {devices} = this.props
    devices.items.forEach(dev => {
      if (on !== dev.state.on) {
        this.props.sendDeviceCommand(dev.id, setDevicePower(dev, on))
      }
    })
  },

  render() {
    const {devices, sensors} = this.props

    const someOn = devices.items.some(device => device.state.on)

    return (
      <div className="container">
        <Header>
          <div>
            <a href="#" onClick={this.toggleAll.bind(null, !someOn)} className="houseStatus">
              <h1>{config.house}</h1>
              {!someOn && <span className="toggleAll on">all on</span>}
              {someOn && <span className="toggleAll off">all off</span>}
            </a>
          </div>
          <div className="sensors">
            <SensorList sensors={sensors.items}/>
          </div>
        </Header>
        <DeviceList
          renderItem={this.renderDevice}
          itemClassName="device"
          items={devices.items}/>
      </div>
    )
  }
})

// Which part of the Redux global state does our component want to receive as props?
function mapStateToProps(state) {
  return {
    devices: state.devices,
    sensors: state.sensors
  }
}

// Which action creators does it want to receive by props?
function mapDispatchToProps(dispatch) {
  return {
    loadSensors() {
      dispatch(loadSensors())
    },
    loadDevices() {
      dispatch(loadDevices())
    },
    sendDeviceCommand(deviceId, command) {
      dispatch(sendDeviceCommand(deviceId, command))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
