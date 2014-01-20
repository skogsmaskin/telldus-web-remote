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
  isPoweredOn: function() {
    return this.isOn() || this.isDimmed();
  },
  isOn: function() {
    return this.state.status.name == 'ON';
  },
  isDimmed: function() {
    return this.state.status.name == 'DIM';
  },
  isDimmable: function() {
    return this.state.methods.indexOf('DIM') > -1;
  },
  onDimStart: function() {
    this.setState({dimInProgress: true})
  },
  onDimEnd: function() {
    this.setState({dimInProgress: false})
  },
  getDimLevel: function() {
    return this.state.status.name === 'DIM' ? this.state.status.level : this.state.status.status === 'ON' ? 255 : 0;
  },
  render: function() {
    var controls = [];

    controls.push(<PowerButton isOn={this.isPoweredOn()} onChange={this.onPowerToggle.bind(this, this.state.id)}/>);

    if (this.isDimmable()) {
      controls.push(<Dimmer 
                level={this.getDimLevel()}
                isOn={this.isOn()}
                onDim={this.dim.bind(this, this.state.id)}
                onDimStart={this.onDimStart}
                onDimEnd={this.onDimEnd}
                onPowerToggle={this.onPowerToggle.bind(this, this.state.id)}/>);
    }
    var name = this.state.status.name == "DIM" ? 'ON' : this.state.status.name;
    var classes = [];
    classes.push(this.isOn() ? 'on' : this.isDimmed() ? 'dimmed' : 'off');
    if (this.state.dimInProgress) classes.push('dimming');
    return <div className={classes.join(" ")}>
      <h3>
        {this.state.name}
      </h3>
      <span> {name} </span>
      {controls}
    </div>
  }
});

module.exports = Device;