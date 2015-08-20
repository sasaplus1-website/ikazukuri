import Radium, { Style } from 'radium';
import React from 'react';

import CanvasArea from '../CanvasArea';
import FooterArea from '../FooterArea';
import HeaderArea from '../HeaderArea';
import LayersArea from '../LayersArea';
import SocialArea from '../SocialArea';

import AppAction from '../../actions/AppAction';

import LayerStore from '../../stores/LayerStore';

import style from './style';

@Radium
class App extends React.Component {

  state = {
    layers: LayerStore.getLayers(),
  };

  //----------------------------------------------------------------------------

  onBeforeUnload = (event) => {
    log('App#onBeforeUnload');
  }

  onDrop = (event) => {
    log('App#onDrop');

    event.preventDefault();
    event.stopPropagation();

    AppAction.dropFiles(event.dataTransfer.files);
  }

  cancelEvent = (event) => {
    event.preventDefault();
    event.stopPropagation();
  }

  updateLayer = () => {
    log('App#updateLayer');

    this.setState({
      layers: LayerStore.getLayers(),
    });
  };

  //----------------------------------------------------------------------------

  componentDidMount() {
    window.addEventListener('beforeunload', this.onBeforeUnload, false);
    window.addEventListener('dragenter', this.cancelEvent, false);
    window.addEventListener('dragover', this.cancelEvent, false);
    window.addEventListener('drop', this.onDrop, false);
    LayerStore.addUpdateLayerListener(this.updateLayer);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onBeforeUnload, false);
    window.removeEventListener('dragenter', this.cancelEvent, false);
    window.removeEventListener('dragover', this.cancelEvent, false);
    window.removeEventListener('drop', this.onDrop, false);
    LayerStore.removeUpdateLayerListener(this.updateLayer);
  }

  //----------------------------------------------------------------------------

  render() {
    return (
      <div>
        <Style rules={style.style} />
        <section style={style.section}>
          <HeaderArea />
          <CanvasArea />
          <LayersArea layers={this.state.layers} />
          <SocialArea />
          <FooterArea />
        </section>
        <div className="github-fork-ribbon-wrapper right">
          <div className="github-fork-ribbon">
            <a href="https://github.com/sasaplus1/ikazukuri">Fork me on GitHub</a>
          </div>
        </div>
      </div>
    );
  }

}

export default App;
