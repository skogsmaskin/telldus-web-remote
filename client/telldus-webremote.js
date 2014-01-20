/** @jsx React.DOM */

var React = require("react");

var DeviceList = require("./elements/device-list");

var api = require("./data/api");

var deviceList = React.renderComponent(<DeviceList/>, document.getElementById('container'));
api.get("/devices", function(err, devices) {
  deviceList.setState({devices: devices})
});