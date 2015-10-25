import React, {PropTypes} from 'react'

export default React.createClass({
  displayName: 'Tappable',
  propTypes: {
    onTap: PropTypes.func,
    children: PropTypes.node,
    delay: PropTypes.number,
    className: PropTypes.string,
    style: PropTypes.object
  },

  getDefaultProps() {
    return {
      delay: 250,
      className: '',
      onTap() {}
    }
  },

  handleMouseDown() {
    this._mouseDownAt = new Date()
  },

  handleMouseMove() {
    this._mouseDownAt = null
  },

  handleMouseUp() {
    const {delay, onTap} = this.props
    const now = new Date()
    if (this._mouseDownAt && now - this._mouseDownAt < delay) {
      onTap()
    }
  },

  render() {
    const {children, className, style} = this.props
    return (
      <div
        className={className}
        style={style}
        onTouchStart={this.handleTouchStart}
        onTouchEnd={this.handleTouchEnd}
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
      >
        {children}
      </div>
    )
  }
})
