/** @jsx React.DOM */

var React = require("react");
var Hammer = require("hammerjs");

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

module.exports = PowerButton;