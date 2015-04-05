import React from "react";
import Draggable from './Draggable.jsx';

function within(val, min, max) {
  return Math.min(Math.max(min, max), Math.max(Math.min(max, min), val));
}

export default React.createClass({
  displayName: 'Dimmer',

  propTypes: {
    onDim: React.PropTypes.func
  },

  getDefaultProps() {
    return { value: 50, level: 100, min: 0, max: 100, amplify: 1 };
  },

  handleDrag(ev) {
    const width = this.getDOMNode().offsetWidth;

    const {value, min, max, amplify} = this.props;

    const val = (ev.x * amplify / width)*max;

    const newLevel = within(value + val, min, max);

    this.props.onDim && this.props.onDim({
      dimlevel: newLevel
    });
  },

  render() {
    return (
      <Draggable {...this.props}
        className="dimmer"
        onDrag={this.handleDrag}>
      {this.props.children}
      </Draggable>
    );
  }
});