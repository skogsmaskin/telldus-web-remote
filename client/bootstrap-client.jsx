/** @jsx React.DOM */

var React = require("react");

var DeviceList = require("./elements/device-list");

var api = require("./data/api");

var initial = JSON.parse(document.getElementById("deviceListInitialData").innerHTML);
React.renderComponent(<DeviceList devices={initial}/>, document.getElementById('container'));