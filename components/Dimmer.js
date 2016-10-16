import React from 'react'
import Draggable from './Draggable'
import ReactDOM from 'react-dom'

function clamp(min, max, val) {
  return Math.max(min, Math.min(max, val))
}

export default class extends React.PureComponent {
  static displayName = 'Dimmer';

  static propTypes = {
    onDim: React.PropTypes.func,
    value: React.PropTypes.number,
    level: React.PropTypes.number,
    min: React.PropTypes.number,
    max: React.PropTypes.number,
    amplify: React.PropTypes.number,
    children: React.PropTypes.node,
    className: React.PropTypes.string,
    style: React.PropTypes.object
  };

  static defaultProps = {
    value: 50,
    level: 100,
    min: 0,
    max: 100,
    amplify: 1,
    onDim() {}
  };

  handleDrag = ev => {
    const width = ReactDOM.findDOMNode(this).offsetWidth
    const {value, min, max, amplify, onDim} = this.props

    const val = ev.x * amplify / width * max

    onDim({
      dimlevel: clamp(min, max, value + val)
    })
  };

  render() {
    const {children, className, style} = this.props
    return (
      <Draggable
        style={style}
        className={className}
        onDrag={this.handleDrag}
      >
        {children}
      </Draggable>
    )
  }
}
