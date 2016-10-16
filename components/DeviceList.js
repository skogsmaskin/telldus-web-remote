import React, {PropTypes} from 'react'
import Color from 'color'
import {flatten} from 'lodash'
import CustomPropTypes from '../lib/PropTypes'
import palette from '../config/palette'
import at from 'circular-at'

const DAY = 4
const COLORS = flatten(palette.map(group => {
  return at(group.colors.slice(0, 4).map(color => color.hex), DAY)
}))

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
