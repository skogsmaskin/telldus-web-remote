import React from 'react';
import cx from 'react/lib/cx';

import domEvent from "dom-event";

export default React.createClass({
  displayName: 'Draggable',
  propTypes: {
    onDrag: React.PropTypes.func
  },

  handleTouchStart(e) {
    //e.preventDefault();
    //e.stopPropagation();
    const touch = e.touches[0];
    this.start({x: touch.clientX, y: touch.clientY});
  },

  handleMouseDown(e) {
    if (e.button !== 0) {
      // Ignore all but left clicks
      return;
    }
    //e.preventDefault();
    //e.stopPropagation();
    this.start({x: e.clientX, y: e.clientY});
  },

  handleWindowTouchEnd(e) {
    //e.preventDefault();
    //e.stopPropagation();
    this.end();
  },
  handleWindowMouseUp(e) {
    //e.preventDefault();
    //e.stopPropagation();
    this.end();
  },
  handleWindowTouchMove(e) {
    //e.preventDefault();
    //e.stopPropagation();
    const touch = e.touches[0];
    this.move({x: touch.clientX, y: touch.clientY});
  },
  handleWindowMouseMove(e) {
    //e.preventDefault();
    //e.stopPropagation();
    this.move({x: e.clientX, y: e.clientY});
  },

  start({x, y}) {
    this._isDragging = true;
    this._prevPosition = {x, y};
    this.addWindowMouseListeners();
  },
  end() {
    this._isDragging = false;
    this.removeWindowMouseListeners();
  },
  move({x, y}) {
    if (!this._isDragging) {
      console.log("Error: (mouse|touch)move listener on window is active even when not dragging");
    }

    this.props.onDrag({
      x: x - this._prevPosition.x,
      y: y - this._prevPosition.y
    });
    this._prevPosition = {x, y};
  },
  removeWindowMouseListeners() {
    domEvent.off(window, 'touchend', this.handleWindowTouchEnd);
    domEvent.off(window, 'mouseup', this.handleWindowMouseUp);

    domEvent.off(window, 'touchmove', this.handleWindowTouchMove);
    domEvent.off(window, 'mousemove', this.handleWindowMouseMove);
  },

  addWindowMouseListeners() {
    domEvent.on(window, 'touchend', this.handleWindowTouchEnd);
    domEvent.on(window, 'mouseup', this.handleWindowMouseUp);

    domEvent.on(window, 'touchmove', this.handleWindowTouchMove);
    domEvent.on(window, 'mousemove', this.handleWindowMouseMove);
  },

  componentWillUnmount() {
    this.removeWindowMouseListeners();
  },

  render() {
    const { className, ...other } = this.props;
    return (
      <div {...other}
        className={['draggable'].concat(className).join(" ")}
        onMouseDown={this.handleMouseDown}
        onTouchStart={this.handleTouchStart}>
        {this.props.children}
      </div>
    );
  }
});
