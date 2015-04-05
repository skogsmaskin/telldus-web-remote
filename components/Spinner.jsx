// Greatly inspired by https://github.com/chenglou/react-spinner
import React from 'react';

export default React.createClass({
  render() {
    const {className, ...rest} = this.props;

    const bars = [];
    for (var i = 0; i < 12; i++) {
      const animationDelay = (i - 12) / 10 + 's';
      const transform = 'rotate(' + (i * 30) + 'deg) translate(146%)';

      const barStyle = {
        animationDelay,
        transform,
        WebkitAnimationDelay: animationDelay,
        WebkitTransform: transform
      };
      bars.push(<div style={barStyle} className="react-spinner_bar" key={i}/>);
    }

    return (
      <div {...rest} className={(className || '') + ' react-spinner'}>
        {bars}
      </div>
    );
  }
});
