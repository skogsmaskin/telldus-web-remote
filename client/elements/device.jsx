/** @jsx React.DOM */

var api = require("../data/api");

var Dimmer = require("./dimmer");

var React = require("react");
var debounce = require("lodash.debounce")

var Device = React.createClass({
  getInitialState: function() {
    return this.props.initialDeviceData;
  },
  onDim: debounce(function(deviceId, level) {
    this.setState({waiting: true})
    api.dim(deviceId, level, function(err, device) {
      this.setState(device);
      this.setState({waiting: false})
    }.bind(this))
  }, 200),
  onPowerToggle: debounce(function(deviceId, turnOn) {
    this.setState({waiting: true})
    api.togglePower(deviceId, turnOn, function(err, device) {
      this.setState(device);
      this.setState({waiting: false})
    }.bind(this))
  }, 200),
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

    if (this.isDimmable()) {
      controls.push(<Dimmer 
                level={this.getDimLevel()}
                isOn={this.isPoweredOn()}
                onDim={this.onDim.bind(this, this.state.id)}
                onDimStart={this.onDimStart}
                onDimEnd={this.onDimEnd}
                onPowerToggle={this.onPowerToggle.bind(this, this.state.id)}/>);
    }

    var classes = [];
    classes.push(this.isOn() ? 'on' : this.isDimmed() ? 'dimmed on' : 'off');
    if (this.state.dimInProgress) classes.push('dimming');
    if (this.state.waiting) classes.push('waiting');

    return <div className={classes.join(" ")}>
        <h3>{this.state.name}</h3>
        {controls}
    </div>
  }
});

module.exports = Device;