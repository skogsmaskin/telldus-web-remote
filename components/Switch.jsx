import cx from "react/lib/cx";
import React from "react";

let diff = ((function() {
  let prev = null;

  return function() {
    let now = new Date();
    let diff = prev === null ? 0 : now - prev;
    prev = now;
    return diff;
  }
}()));

module.exports = React.createClass({
  displayName: 'Switch',

  handleTouchStart(e) {
    this.setState({debug: this.state.debug.concat(`touchstart +${diff()}`)})
  },

  handleTouchEnd(e) {
    this.setState({debug: this.state.debug.concat(`touchend +${diff()}`)})
  },

  handleMouseDown(e) {
    this._mouseDownAt = new Date();
    this.setState({debug: this.state.debug.concat(`mousedown +${diff()}`)})
  },

  handleMouseMove(e) {
    this._mouseDownAt = null;
    //this.setState({debug: this.state.debug.concat(`mousemove +${diff()}`)})
  },

  handleMouseUp(e) {
    var now = new Date()
    if (this._mouseDownAt && now - this._mouseDownAt < 250) {
      this.props.onToggle(!this.props.on);
      this.setState({debug: this.state.debug.concat(`click +${diff()}`)})
    }
  },

  getInitialState() {
    return {
      debug: []
    }
  },

  render() {
    return (
      <div {...this.props}
        onTouchStart={this.handleTouchStart}
        onTouchEnd={this.handleTouchEnd}
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
      >
        {/*this.state.debug.map((d)=> <li>{d}</li>)*/}
        {this.props.children}
      </div>
    );
  }
});