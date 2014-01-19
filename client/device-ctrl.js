/** @jsx React.DOM */

var React = require("react");

var api = require("./api")

var Dimmer = React.createClass({
  getInitialState: function() {
    return {adjustingLevel: 0};
  },
  dim: function(e) {
    var level = Number(e.target.value)
    this.setState({adjustingLevel: level})
    this.props.onDim(level);
  },
  componentWillReceiveProps: function() {
    this.setState({adjustingLevel: 0});
  },
  render: function() {
    var level = this.state.adjustingLevel || (this.props.state === 'DIM' ? this.props.level : this.props.state === 'ON' ? 255 : 0);
    return <span>
        <input type="range" min="1" max="255" step="1" value={level} onChange={this.dim}/> {((100/255)*level).toFixed()}%
        </span>
  }
});

var PowerButton = React.createClass({
  toggle: function(e) {
    this.props.onChange(!this.props.isOn);
  },
  render: function() {
    var label = this.props.isOn ? "Turn OFF" :  "Turn ON"
    var classes = ['default', this.props.isOn ? 'on' : 'off'];
    return <input type="checkbox" className={classes.join(" ")} onClick={this.toggle} />
  }
});

module.exports = React.createClass({
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
  render: function() {
    var controls = [];
    var isOn = this.state.status.name == 'ON' || this.state.status.name == 'DIM';

    controls.push(<PowerButton isOn={isOn} onChange={this.onPowerToggle.bind(this, this.state.id)}/>);

    if (this.state.methods.indexOf('DIM') > -1) {
      controls.push(<li><Dimmer level={this.state.status.level} state={this.state.status.name} onDim={this.dim.bind(this, this.state.id)}/></li>);
    }
    var name = this.state.status.name == "DIM" ? 'ON' : this.state.status.name;
    var badgeClasslist = ['badge'].concat(name.toLowerCase());
    return <div>
      <h3>
        {this.state.name}
      </h3>
      <span class={badgeClasslist.join(" ")}> {name} </span>
      <span className="percent">0%</span>
      {controls}
    </div>
  }
});