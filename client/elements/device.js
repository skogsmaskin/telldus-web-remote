/** @jsx React.DOM */

var api = require("../data/api");

var Dimmer = require("./dimmer");
var PowerButton = require("./power-button");

var React = require("react");

var Device = React.createClass({
  getInitialState: function() {
    return this.props.initialDeviceData;
  },
  dim: function(deviceId, level) {
    api.dim(deviceId, level, function(err, device) {
      this.setState(device);
    }.bind(this))
  },
  onPowerToggle: function(deviceId, turnOn) {
    api.togglePower(deviceId, turnOn, function(err, device) {
      this.setState(device);
    }.bind(this))
  },
  isOn: function() {
    return this.state.status.name == 'ON' || this.state.status.name == 'DIM';
  },
  isDimmable: function() {
    return this.state.methods.indexOf('DIM') > -1;
  },
  getDimLevel: function() {
    return this.state.status.name === 'DIM' ? this.state.status.level : this.state.status.status === 'ON' ? 255 : 0;
  },
  render: function() {
    var controls = [];

    controls.push(<PowerButton isOn={this.isOn()} onChange={this.onPowerToggle.bind(this, this.state.id)}/>);

    if (this.isDimmable()) {
      controls.push(<Dimmer level={this.getDimLevel()} onDim={this.dim.bind(this, this.state.id)}/>);
    }
    var name = this.state.status.name == "DIM" ? 'ON' : this.state.status.name;
    var badgeClasslist = ['badge'].concat(name.toLowerCase());
    return <div>
      <h3>
        {this.state.name}
      </h3>
      <span className={badgeClasslist.join(" ")}> {name} </span>
      {controls}
    </div>
  }
});

module.exports = Device;