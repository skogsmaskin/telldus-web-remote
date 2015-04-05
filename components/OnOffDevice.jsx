import cx from "react/lib/cx";
import React from "react";
import DeviceActions from "../actions/DeviceActions";
import Switch from './Switch.jsx';

export default React.createClass({
  displayName: 'OnOffDevice',

  handleToggle() {
    const {device} = this.props;
    const action = device.status.name === 'ON' ? 'turnOff' : 'turnOn';
    DeviceActions[action]({deviceId: device.id})
  },

  render() {
    const {device} = this.props;
    const {status} = device;
    const isOn = device.status.on;
    const isOff = !isOn;
    return (
      <Switch className={cx({isOn, isOff})} on={isOn} onToggle={this.handleToggle}>
        <h3>{device.name}</h3>
        <span className="switchState">{isOn ? 'ON' : 'OFF'}</span>
      </Switch>
    );
  }
});