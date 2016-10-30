import {on, off} from 'dom-event'
import React, {PropTypes} from 'react'
import {omit} from 'lodash'
import Debug from 'debug'

const debug = Debug('drag-aware')

function getComponentName(component) {
  if (typeof component === 'string') {
    return component
  }
  return component.name || component.displayName || '<anonymous>'
}

function readThreshold(value) {
  if (typeof value === 'number') {
    return {x: value, y: value}
  }
  return value
}

// Returns a component that emits `onDragStart, `onDrag` and `onDragEnd` events.
// It handles mouse/touch events the same way
// - `onDragStart` is called with the {x, y} positions relative from the dom node (e.g. where the mousedown event happened)
// - `onDrag` and `onDragEnd` are both called with the {x, y} difference from the previous position
export default function makeDragAware(Component, options = {}) {
  const threshold = readThreshold(options.threshold || 0)

  return class DragAware extends React.PureComponent {
    static displayName = `${getComponentName(Component)}$DragAware`
    static propTypes = {
      onDragStart: PropTypes.func,
      onDrag: PropTypes.func,
      onDragEnd: PropTypes.func,
      onClick: PropTypes.func
    };

    static defaultProps = {
      onDragStart() {},
      onDragEnd() {},
      onDrag() {},
      onClick() {}
    };

    componentDidMount() {
      const {onDragStart, onDrag, onDragEnd} = this.props

      debug('Draggable component did mount')
      const win = getWindow()
      const supportsTouch = ('ontouchstart' in window)
      const domNode = this.domNode

      const EVENT_NAMES = {
        start: supportsTouch ? 'touchstart' : 'mousedown',
        move: supportsTouch ? 'touchmove' : 'mousemove',
        end: supportsTouch ? 'touchend' : 'mouseup'
      }

      let dragging = false
      let currentPos = null

      let moveListener
      let endListener

      const startListener = listen(domNode, EVENT_NAMES.start, handleMouseDown, {passive: true})

      this.getDisposables = () => {
        return [
          moveListener,
          endListener,
          startListener
        ]
      }

      const self = this
      function handleMouseDown(event) {
        self._mouseDownAt = Date.now()
        if (dragging) {
          debug('Start cancelled, already a drag in progress')
          return
        }
        if (event.currentTarget !== domNode) {
          // Event happened outside of this dom node
          return
        }

        currentPos = getPos(event)
        moveListener = listen(win, EVENT_NAMES.move, handleMouseMove, {passive: true})
        endListener = listen(win, EVENT_NAMES.end, handleMouseUp, {passive: true})
      }

      function handleMouseMove(event) {

        const nextPos = getPos(event)
        const diff = diffPos(nextPos, currentPos)
        if (!dragging) {
          if (Math.abs(diff.x) < threshold.x && Math.abs(diff.y) < threshold.y) {
            return
          }
          dragging = true
          debug('Drag started %o', nextPos)
          onDragStart(getPositionRelativeToRect(currentPos.x, currentPos.y, domNode.getBoundingClientRect()))
        }

        onDrag(diff)
        debug('moving by %o', diff)
        currentPos = nextPos
      }

      function handleMouseUp(event) {
        const nextPos = getPos(event)
        onDragEnd(getPositionRelativeToRect(nextPos.x, nextPos.y, domNode.getBoundingClientRect()))
        dragging = false
        currentPos = null

        moveListener.dispose()
        moveListener = null

        endListener.dispose()
        endListener = null

        debug('Done moving %o', nextPos)
      }
    }

    componentWillUnmount() {
      debug('Disposing event listeners')
      this.dispose()
    }

    dispose() {
      this.getDisposables().filter(Boolean).forEach(disposable => disposable.dispose())
    }
    setDomNode = node => {
      this.domNode = node
    }

    handleClick = e => {
      if (Date.now() - this._mouseDownAt > 200) {
        e.preventDefault()
      } else {
        debug('emit onclick')
        this.props.onClick(e)
      }
    }

    render() {
      return (
        <Component
          ref={this.setDomNode}
          {...omit(this.props, ['onDragStart', 'onDragEnd', 'onDrag'])}
          onClick={this.handleClick}
        />
      )
    }
  }
}

function getPositionRelativeToRect(x, y, rect) {
  return {
    x: x - rect.left,
    y: y - rect.top
  }
}

function getWindow() {
  /* global window */
  return typeof window === 'undefined' ? null : window
}

function getPos(event) {
  if (event instanceof TouchEvent) {
    return event.touches.length ? getPos(event.touches[0]) : {x: 0, y: 0}
  }
  return {
    x: event.clientX,
    y: event.clientY
  }
}

function diffPos(pos, otherPos) {
  return {
    x: pos.x - otherPos.x,
    y: pos.y - otherPos.y
  }
}

function listen(element, type, handler, capture) {
  on(element, type, handler, capture)
  return {
    dispose() {
      off(element, type, handler)
    }
  }
}
