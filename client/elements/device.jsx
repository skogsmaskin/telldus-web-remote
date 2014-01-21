/** @jsx React.DOM */

var api = require("../data/api");

var PowerButton = require("./power-button");

var pos = require('dom.position');

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

  componentDidMount: function() {
    var Hammer = require("hammerjs");
    this.availWidth = this.getDOMNode().offsetWidth;
    this.hammer = Hammer(this.getDOMNode(), {
      drag_block_vertical: false,
      drag_block_horizontal: false,
      prevent_default: false,
      drag_min_distance: 30,
      drag_lock_to_axis: true
    });
    this.hammer.on('tap', this.tap);
    this.hammer.on('dragstart', this.dragStart);
    this.hammer.on('dragend', this.dragEnd);
    this.hammer.on('drag', this.drag);
  },

  componentWillUnmount: function() {
    this.hammer.off('tap', this.tap);
    this.hammer.off('dragstart', this.dragStart);
    this.hammer.off('dragend', this.dragEnd);
    this.hammer.off('drag', this.drag );
  },
  tap: function(e) {
    this.onPowerToggle(!this.isPoweredOn())
  },
  dragStart: function(e) {
    var mousePos = e.gesture.center;
    var ppos = pos(e.currentTarget);
    var x = mousePos.pageX - ppos.left;
    var level = this.fromPixelValue(x);
    this.setDimLevel(level);
    this.dragStartDimLevel = level;
    this.onDimStart();
    this.onDim(this.state.id, level);
  },
  dragEnd: function(e) {
    this.onDimEnd()
  },
  drag: function(event) {
    var gesture = event.gesture;
    var level = this.dragStartDimLevel+this.fromPixelValue(gesture.deltaX)
    this.setDimLevel(level);
    this.onDim(this.state.id, level)
  },
  setDimLevel: function(level) {
    this.setState({status: { name: 'DIM', level: level }});
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
  fromPixelValue: function(px) {
    return (px/this.availWidth)*255;
  },
  toPixelValue: function(dimLevel) {
    return (dimLevel/255)*this.availWidth;
  },
  toPercentage: function(level) {
    return ((100/255)*level).toFixed()
  },
  calculateCssWidth: function() {
    return ('availWidth' in this) ? this.toPixelValue(this.getDimLevel())+"px" : this.toPercentage(this.getDimLevel())+"%";
  },
  render: function() {
    var controls = [];

    if (this.isDimmable()) {
      var dimmerStyle = { width: this.calculateCssWidth() }
      controls.push(<div className="dimmer"><span className="divider" style={dimmerStyle}/></div>);
    }
    else {
      controls.push(<PowerButton isOn={this.isPoweredOn()} onChange={this.onPowerToggle.bind(this, this.state.id)}/>);
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