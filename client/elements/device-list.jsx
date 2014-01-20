/** @jsx React.DOM */

var React = require("react");
var Device = require("./device");

var DeviceList = React.createClass({
  render: function() {

    var devices = this.props.devices.map(function(device) {
      return <li className="device"><Device initialDeviceData={device}/></li>
    });

    return <ul className="devices">
        {devices}
      </ul>;
  }
});

module.exports = DeviceList;