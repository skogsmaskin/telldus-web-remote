/** @jsx React.DOM */

var React = require("react");

var api = require("./api")

var Hammer = require("hammerjs")

var Dimmer = React.createClass({
  getInitialState: function() {
    return {level: this.props.level};
  },
  componentDidMount: function() {
    this.availWidth = this.getDOMNode().offsetWidth;
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
  toggleDrag: function() {
    if (!this.dragging) {
      this.dragStartLevel = this.state.level;
      this.dragging = true;
    }
    else {
      this.dragging = false;
    }
  },
  drag: function(event) {
    var gesture = event.gesture;
    this.setState({level: this.dragStartLevel+this.fromPixelValue(gesture.deltaX)});
    this.props.onDim(this.state.level)
  },
  fromPixelValue: function(px) {
    return (px/this.availWidth)*255;
  },
  toPercentage: function(level) {
    return ((100/255)*level).toFixed()
  },
  render: function() {
    var percentage = this.toPercentage(this.state.level);
    var style = {width: percentage+"%"}
    return <div className="dimmer">
            <span className="divider" style={style}/>
          </div>
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