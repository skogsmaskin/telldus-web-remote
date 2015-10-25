import React, {PropTypes} from'react'

export default React.createClass({
  displayName: 'Header',

  propTypes: {
    children: PropTypes.node
  },

  render() {
    const {children} = this.props
    return (
      <div className="header">
        {children}
      </div>
    )
  }
})
