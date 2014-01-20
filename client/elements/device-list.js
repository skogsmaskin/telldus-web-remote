/** @jsx React.DOM */

var React = require("react");
var Device = require("./device");

var DeviceList = React.createClass({
  getInitialState: function() {
    return {devices: []};
  },
  render: function() {

    var devices = this.state.devices.map(function(device) {
      return <li className="device"><Device initialDeviceData={device}/></li>
    });

    return <ul className="devices">
        {devices}
      </ul>;
  }
});

module.exports = DeviceList;