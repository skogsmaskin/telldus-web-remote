import React, {PropTypes} from 'react'
import classNames from 'classnames'
import CustomPropTypes from '../lib/PropTypes'

import Spinner from './Spinner'
import Dimmer from './Dimmer'
import Tappable from './Tappable'

function getDeviceState(device) {
  return device._pendingState || device.state
}

function toggledDevicePower(device) {
  const currentState = getDeviceState(device)
  if (device.dimmable) {
    return {
      name: currentState.on ? 'turnOff' : 'dim',
      dimlevel: currentState.on ? 0 : 100
    }
  }
  return {
    name: currentState.on ? 'turnOff' : 'turnOn'
  }
}

export default React.createClass({
  displayName: 'DimmableDevice',
  propTypes: {
    device: CustomPropTypes.device,
    onCommand: PropTypes.func
  },

  handleDim(ev) {
    const {device, onCommand} = this.props
    const deviceState = getDeviceState(device)

    onCommand(device.id, {
      name: 'dim',
      dimlevel: deviceState.on ? ev.dimlevel : 0
    })
  },
  handleToggle() {
    const {device, onCommand} = this.props
    onCommand(device.id, toggledDevicePower(device))
  },
  renderDeviceState(device) {
    const deviceState = getDeviceState(device)
    if (device.dimmable) {
      return deviceState.on ? `${Math.round(deviceState.dimlevel)}%` : 'OFF'
    }
    return deviceState.on ? 'ON' : 'OFF'
  },
  renderDeviceInfo(device) {
    const inSync = !('_pendingState' in device)
    return (
      <div className="deviceContainer">
        <div className="deviceInfo">
          <h3>
            {device.name}
          </h3>
        </div>
        <div className="deviceState">
          {this.renderDeviceState(device)}
          {!inSync && <Spinner/>}
        </div>
      </div>
    )
  },
  render() {
    const {device} = this.props
    const deviceState = getDeviceState(device) || {}

    const deviceInfo = this.renderDeviceInfo(device)

    const wrapInDimmable = children => {
      const opacity = deviceState.on ? (deviceState.dimlevel / 100) * 0.5 : 0
      return (
        <Dimmer
          value={deviceState.dimlevel}
          min={0}
          max={100}
          step={1}
          amplify={1.9}
          onDim={this.handleDim}
          style={{backgroundColor: `rgba(255, 255, 200, ${opacity})`}}
          >
          {children}
        </Dimmer>
      )
    }

    return (
      <Tappable onTap={this.handleToggle}>
        <div className={classNames({isOn: deviceState.on})}>
          {device.dimmable ? wrapInDimmable(deviceInfo) : deviceInfo}
        </div>
      </Tappable>
    )
  }
})
