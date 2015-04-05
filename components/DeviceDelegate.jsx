import React from "react";
import cx from "react/lib/cx";

import DimmableDevice from './DimmableDevice.jsx';
import OnOffDevice from './OnOffDevice.jsx';

module.exports = React.createClass({
  displayName: 'DeviceDelegate',

  render() {
    const {device} = this.props;

    const Delegate = device.dimmable ? DimmableDevice : OnOffDevice;

    return <Delegate {...this.props}/>
  }
});
