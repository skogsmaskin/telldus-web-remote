import React, {PropTypes} from 'react'
import classNames from 'classnames'
import CustomPropTypes from '../lib/PropTypes'

import Spinner from './Spinner'
import Dimmer from './Dimmer'
import {isDimmable, isSwitch} from '../lib/deviceUtils'

function getDeviceState(device) {
  return device._pendingState || device.state
}

function toggledDevicePower(device) {
  const currentState = getDeviceState(device)
  if (isDimmable(device)) {
    return {
      name: currentState.on ? 'turnOff' : 'dim',
      dimlevel: currentState.on ? 0 : 100
    }
  }
  return {
    name: currentState.on ? 'turnOff' : 'turnOn'
  }
}

export default class DimmableDevice extends React.PureComponent {

  static propTypes = {
    device: CustomPropTypes.device,
    onCommand: PropTypes.func
  };

  handleDim = ev => {
    const {device, onCommand} = this.props
    const deviceState = getDeviceState(device)

    onCommand(device.id, {
      name: 'dim',
      dimlevel: deviceState.on ? ev.dimlevel : 0
    })
  };

  handleToggle = () => {
    const {device, onCommand} = this.props
    if (isSwitch(device)) {
      onCommand(device.id, toggledDevicePower(device))
    }
  };

  renderDeviceState = device => {
    const deviceState = getDeviceState(device)
    if (isDimmable(device)) {
      return deviceState.on ? `${Math.round(deviceState.hasOwnProperty('dimlevel') ? deviceState.dimlevel : 100)}%` : 'OFF'
    }
    if (isSwitch(device)) {
      return deviceState.on ? 'ON' : 'OFF'
    }
    return null
  };

  renderDeviceInfo = device => {
    const inSync = !device._pendingState
    return (
      <div className="deviceContainer">
        <div className="deviceInfo">
          <h3>
            {device.name}
          </h3>
        </div>
        <div className="deviceState">
          {this.renderDeviceState(device)}
          {!inSync && <Spinner />}
        </div>
      </div>
    )
  };

  renderDimmer = () => {
    const {device} = this.props
    const deviceState = getDeviceState(device) || {}

    const opacity = deviceState.on ? (deviceState.dimlevel / 100) * 0.5 : 0

    return (
      <Dimmer
        value={deviceState.dimlevel}
        min={0}
        max={100}
        step={1}
        amplify={1.9}
        onDim={this.handleDim}
        onSwitch={this.handleToggle}
        style={{backgroundColor: `rgba(255, 255, 200, ${opacity})`}}
      >
        {this.renderDeviceInfo(device)}
      </Dimmer>
    )
  };

  render() {
    const {device} = this.props
    const deviceState = getDeviceState(device) || {}
    return (
      <div onClick={this.handleToggle} className={classNames({isOn: deviceState.on})}>
        {isDimmable(device) ? this.renderDimmer() : this.renderDeviceInfo(device)}
      </div>
    )
  }
}