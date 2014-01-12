/** @jsx React.DOM */

var React = require("react");
var DeviceCtrl = require("./device-ctrl");

module.exports = React.createClass({
  getInitialState: function() {
    return {devices: []};
  },
  render: function() {
    var devices = this.state.devices.map(function(device) {
      return <li className="device"><DeviceCtrl initialDeviceData={device}/></li>
    });

    return <ul className="devices">
        {devices}
      </ul>;
  }
});