/** @jsx React.DOM */

var React = require("react");

var pos = require('dom.position');

var Dimmer = React.createClass({
  getInitialState: function() {
    return {level: this.props.level};
  },
  componentDidMount: function() {
    var Hammer = require("hammerjs");
    this.availWidth = this.getDOMNode().offsetWidth;
    this.hammer = Hammer(this.getDOMNode());
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
    this.props.onPowerToggle(!this.props.isOn)
  },
  dragStart: function(e) {
    var mousePos = e.gesture.center;
    var ppos = pos(e.currentTarget);
    var x = mousePos.pageX - ppos.left;
    this.setState({level: this.fromPixelValue(x)});
    this.props.onDim(this.state.level)
    this.props.onDimStart();
    this.dragStartLevel = this.state.level;
  },
  dragEnd: function(e) {
    this.props.onDimEnd()
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

module.exports = Dimmer;