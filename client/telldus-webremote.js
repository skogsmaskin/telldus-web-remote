/** @jsx React.DOM */
var React = require("react");
var Hammerjs = require("hammerjs");

var Status = require("./status");

var api = require("./api")

var component = React.renderComponent(<Status/>, document.getElementById('container'));
api.get("/devices", function(err, devices) {
  component.setState({devices: devices})
})