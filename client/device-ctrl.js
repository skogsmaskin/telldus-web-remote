/** @jsx React.DOM */

var React = require("react");

var api = require("./api")

var Hammer = require("hammerjs")

var Dimmer = React.createClass({
  componentDidMount: function() {
    this.getDOMNode().style.width="100%";
    this.availWidth = this.getDOMNode().offsetWidth;
    this.getDOMNode().style.width = this.toPercentage(this.getLevel())+"%";
    this.hammer = Hammer(this.getDOMNode());
    this.hammer.on('dragstart', this.toggleDrag);
    this.hammer.on('dragend', this.toggleDrag);
    this.hammer.on('drag', this.drag);
  },
  componentWillUnmount: function() {
    this.hammer.off('dragstart', this.toggleDrag);
    this.hammer.off('dragend', this.toggleDrag);
    this.hammer.off('drag', this.drag );
  },
  componentWillReceiveProps: function() {
    this.setState({adjustingLevel: 0});
  },
  toggleDrag: function() {
    if (!this.dragging) {
      this.dragStartWidth = this.getDOMNode().offsetWidth;
      this.dragging = true;
    }
    else {
      this.dragStartWidth = null;
      this.dragging = false;
    }
  },
  drag: function(event) {
    var gesture = event.gesture;
    var normalizedLevel = this.normalizeLevel(this.dragStartWidth+gesture.deltaX); 
    this.getDOMNode().style.width = this.toPercentage(normalizedLevel)+"%";
    this.props.onDim(normalizedLevel)
  },
  normalizeLevel: function(level) {
    level = level < 0 ? 0 : level > this.availWidth ? this.availWidth : level;
    return (255 / this.availWidth) * level
  },
  getLevel: function() {
    return this.props.state === 'DIM' ? this.props.level : this.props.state === 'ON' ? 255 : 0
  },
  toPercentage: function(level) {
    return ((100/255)*level).toFixed()
  },
  render: function() {
    return <span className="divider"></span>
  }
});

var PowerButton = React.createClass({
  toggle: function(e) {
    this.props.onChange(!this.props.isOn);
  },
  componentDidMount: function() {
    this.hammer = Hammer(this.getDOMNode());
    this.hammer.on('tap', this.toggle );
  },
  componentWillUnmount: function() {
    this.hammer.off('tap', this.toggle );
  },
  render: function() {
    var classes = ['default', this.props.isOn ? 'on' : 'off'];
    return <input type="checkbox" className={classes.join(" ")}/>
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

  isOn: function() {
    return this.state.status.name == 'ON' || this.state.status.name == 'DIM';
  },
  isDimmable: function() {
    return this.state.methods.indexOf('DIM') > -1;
  },
  render: function() {
    var controls = [];

    controls.push(<PowerButton isOn={this.isOn()} onChange={this.onPowerToggle.bind(this, this.state.id)}/>);

    if (this.isDimmable()) {
      controls.push(<Dimmer level={this.state.status.level} state={this.state.status.name} onDim={this.dim.bind(this, this.state.id)}/>);
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