import React, {PropTypes} from 'react'
import Color from 'color'
import CustomPropTypes from '../lib/PropTypes'

const COLORS = '#42c401 #fe2002 #00afec #eddb00 #ec7632 #ea148c'.split(' ')

function colorFor(index) {
  return COLORS[index % COLORS.length]
}

export default class extends React.PureComponent {
  static displayName = 'DeviceList';

  static propTypes = {
    items: PropTypes.arrayOf(CustomPropTypes.device),
    itemClassName: PropTypes.string,
    renderItem: PropTypes.func
  };

  render() {
    const {itemClassName, items, renderItem} = this.props
    return (
      <ul className="devices">
        {items.map((item, i) => {
          const color = new Color(colorFor(i)).darken(0.5).hexString()
          return (
            <li key={item.id} style={{backgroundColor: color}} className={itemClassName}>
              {renderItem(item, i)}
            </li>
          )
        })}
      </ul>
    )
  }
}
