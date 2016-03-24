// Inspired by https://github.com/chenglou/react-spinner
import React, {PropTypes} from 'react'

function range(num) {
  return new Array(num).fill(0)
}

export default React.createClass({
  propTypes: {
    className: PropTypes.string,
    style: PropTypes.object
  },
  getDefaultProps() {
    return {
      className: ''
    }
  },
  render() {
    const {className, style} = this.props

    const bars = range(12).map(i => {
      const animationDelay = `${(i - 12) / 10}s`
      const transform = `rotate(${i * 30}deg) translate(146%)`
      const barStyle = {
        animationDelay,
        transform,
        WebkitAnimationDelay: animationDelay,
        WebkitTransform: transform
      }
      return <div style={barStyle} className="react-spinner_bar" key={i}/>
    })

    return (
      <div className={`${className} react-spinner`} style={style}>
        {bars}
      </div>
    )
  }
})
