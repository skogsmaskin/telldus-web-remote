import React, {PropTypes} from 'react'

import on from '../lib/util/dom-on'

export default React.createClass({
  displayName: 'Draggable',
  propTypes: {
    onDrag: PropTypes.func,
    children: PropTypes.node,
    className: PropTypes.string,
    threshold: PropTypes.shape({x: PropTypes.number, y: PropTypes.number}),
    style: PropTypes.object
  },

  getDefaultProps() {
    return {
      threshold: {x: 10, y: Infinity}
    }
  },

  componentWillUnmount() {
    this.removeWindowMouseListeners()
  },

  handleTouchStart(event) {
    const touch = event.touches[0]
    this.start({x: touch.clientX, y: touch.clientY})
  },

  handleMouseDown(event) {
    if (event.button !== 0) {
      // Ignore all but left clicks
      return
    }
    this.start({x: event.clientX, y: event.clientY})
  },

  handleWindowTouchEnd(event) {
    this.end()
  },

  handleWindowMouseUp(event) {
    this.end()
  },

  handleWindowTouchMove(event) {
    const touch = event.touches[0]
    this.move({x: touch.clientX, y: touch.clientY})
  },

  handleWindowMouseMove(event) {
    this.move({x: event.clientX, y: event.clientY})
  },

  start({x, y}) {
    this._startPosition = this._prevPosition = {x, y}
    this.addWindowMouseListeners()
  },
  end() {
    this._isDragging = false
    this.removeWindowMouseListeners()
  },
  move({x, y}) {

    const {threshold} = this.props

    if (!this._isDragging) {
      if (Math.abs(x - this._startPosition.x) < threshold.x && Math.abs(y - this._startPosition.y) < threshold.y) {
        return
      }
      this._isDragging = true
    }

    if (!this._isDragging) {
      console.log('Error: (mouse|touch)move listener on window is active even when not dragging')
    }

    this.props.onDrag({
      x: x - this._prevPosition.x,
      y: y - this._prevPosition.y
    })
    this._prevPosition = {x, y}
  },

  removeWindowMouseListeners() {
    this.removeListeners.forEach(fn => fn())
  },

  addWindowMouseListeners() {
    this.removeListeners = [
      ['touchEnd', this.handleWindowTouchEnd],
      ['mouseup', this.handleWindowMouseUp],
      ['touchmove', this.handleWindowTouchMove],
      ['mousemove', this.handleWindowMouseMove]
    ]
      .map(([event, handler]) => on(window, event, handler))
  },

  render() {
    const {children, className, style} = this.props
    return (
      <div
        style={style}
        className={['draggable', className].filter(Boolean).join(' ')}
        onMouseDown={this.handleMouseDown}
        onTouchStart={this.handleTouchStart}>
        {children}
      </div>
    )
  }
})
