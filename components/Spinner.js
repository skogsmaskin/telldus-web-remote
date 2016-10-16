// Inspired by https://github.com/chenglou/react-spinner
import React, {PropTypes} from 'react'
import {range} from 'lodash'

export default class Spinner extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    className: ''
  };

  render() {
    const {className, style} = this.props

    const bars = range(12).map((_, i) => {
      const animationDelay = `${(i - 12) / 10}s`
      const transform = `rotate(${i * 30}deg) translate(146%)`
      const barStyle = {
        animationDelay,
        transform,
        WebkitAnimationDelay: animationDelay,
        WebkitTransform: transform
      }
      return <div style={barStyle} className="react-spinner_bar" key={i} />
    })

    return (
      <div className={`${className} react-spinner`} style={style}>
        {bars}
      </div>
    )
  }
}
