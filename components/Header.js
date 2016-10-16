import React, {PropTypes} from 'react'

export default class extends React.PureComponent {
  static displayName = 'Header';

  static propTypes = {
    children: PropTypes.node
  };

  render() {
    const {children} = this.props
    return (
      <div className="header">
        {children}
      </div>
    )
  }
}
