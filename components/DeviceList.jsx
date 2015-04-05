import React from "react";
import DeviceDelegate from "./DeviceDelegate.jsx";
import Color from 'color';

const COLORS = "#42c401 #fe2002 #00afec #eddb00 #ec7632 #ea148c".split(" ");

function colorFor(index) {
  return COLORS[index % COLORS.length];
}


module.exports = React.createClass({
  displayName: 'DeviceList',
  render() {
    return (
      <ul {...this.props} className="devices">
        {this.props.devices.map((device, i) => {
          const color = new Color(colorFor(i)).darken(0.5).hexString();
          return <li key={device.id+'-'+device.name} style={{backgroundColor: color}} className="device">
            <DeviceDelegate device={device}>
              <h3>{device.name}</h3>
            </DeviceDelegate>
          </li>
        })}
      </ul>
    );
  }
});