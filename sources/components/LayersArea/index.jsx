import Radium from 'radium';
import React from 'react';

import Layer from '../Layer';

import style from './style';

@Radium
class LayersArea extends React.Component {

  static propTypes = {
    layers: React.PropTypes.array,
  };

  static defaultProps = {
    layers: [],
  };

  render() {
    return (
      <section>
        {
          this.props.layers.map(
            (layer, index) => (<Layer key={layer.id} index={index + 1} {...layer} />)
          )
        }
      </section>
    );
  }

}

export default LayersArea;
