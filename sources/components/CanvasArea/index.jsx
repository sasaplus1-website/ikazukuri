import Radium from 'radium';
import React from 'react';

import CanvasAction from '../../actions/CanvasAction';
import LayerAction from '../../actions/LayerAction';

import CanvasStore from '../../stores/CanvasStore';
import LayerStore from '../../stores/LayerStore';

import style from './style';

@Radium
class CanvasArea extends React.Component {

  redraw = () => {
    log('CanvasArea#redraw');

    let canvas = React.findDOMNode(this.refs.canvas),
        context = canvas.getContext('2d'),
        background = CanvasStore.getBackground();

    context.textBaseline = 'top';

    // clear canvas
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // draw background image
    if (background) {
      context.drawImage(
        background,
        0, 0,
        background.width * (canvas.width / background.width),
        background.height * (canvas.height / background.height)
      );
    }

    // draw text layers
    LayerStore.getLayers().sort(
      (a, b) => a.order - b.order
    ).forEach(
      (layer) => {
        log(layer);

        context.font = `${layer.size}px 'イカモドキ', sans-serif`;

        context.fillStyle = layer.color;
        context.strokeStyle = layer.color;

        switch (layer.style) {
          case 'fill':
            context.fillText(layer.text, layer.x, layer.y);
            break;
          case 'stroke':
            context.strokeText(layer.text, layer.x, layer.y);
            break;
          default:
            context.fillText(layer.text, layer.x, layer.y);
        }
      }
    );
  }

  saveCanvas = (dataUrl) => {
    log('CanvasArea#saveCanvas', dataUrl);

    let url = URL.createObjectURL(CanvasStore.toBlob(dataUrl));

    if (window.chrome) {
      // for Chrome
      let a = document.createElement('a');

      // browser to crash if use this:
      //   a.href = dataUrl;
      a.href = url;
      a.download = 'ikazukuri.png';
      a.dispatchEvent(new Event('click', { bubbles: true }));

      a = null;
    } else if (typeof document.documentElement.style.MozAppearance !== 'undefined') {
      // for Firefox
      // TODO: how to click a element
      window.open(url);
    }

    URL.revokeObjectURL(url);
    url = null;
  }

  //----------------------------------------------------------------------------

  componentDidMount() {
    CanvasStore.addUpdateBackgroundListener(this.redraw);
    CanvasStore.addSaveCanvasListener(this.saveCanvas);
    LayerStore.addUpdateLayerListener(this.redraw);
  }

  componentWillUnmount() {
    CanvasStore.removeUpdateBackgroundListener(this.redraw);
    CanvasStore.removeaveCanvasListener(this.saveCanvas);
    LayerStore.removeUpdateLayerListener(this.redraw);
  }

  //----------------------------------------------------------------------------

  onClickAddText(event) {
    log('CanvasArea#onClickAddText', event);

    LayerAction.add();
  }

  onClickBackgroundChange(event) {
    log('CanvasArea#onClickBackgroundChange', event);

    let eventData;

    if (window.chrome) {
      // for Chrome
      eventData = new Event('click', { bubbles: true });
    } else if (typeof document.documentElement.style.MozAppearance !== 'undefined') {
      // for Firefox
      eventData = document.createEvent('MouseEvents');
      eventData.initEvent('click', true, false);
    }

    if (eventData) {
      log('CanvasArea#onClickBackgroundChange dispatchEvent', eventData);

      React.findDOMNode(this.refs.input).dispatchEvent(eventData);
    }
  }

  onClickSaveWithHalfSize(event) {
    log('CanvasArea#onClickSaveWithHalfSize', event);

    let canvas = React.findDOMNode(this.refs.canvas);

    CanvasAction.saveHalfSize(canvas, canvas.width, canvas.height);
  }

  onClickSaveWithFullSize(event) {
    log('CanvasArea#onClickSaveWithFullSize', event);

    let canvas = React.findDOMNode(this.refs.canvas);

    CanvasAction.saveFullSize(canvas, canvas.width, canvas.height);
  }

  onChangeFile(event) {
    log('CanvasArea#onChangeFile', event);

    CanvasAction.uploadFile(event.target.files[0]);
  }

  //----------------------------------------------------------------------------

  render() {
    return (
      <section style={style.section}>
        <canvas style={style.canvas} ref="canvas" width="1280" height="960" />
        <div style={style.div}>
          <button style={style.button} onClick={this.onClickAddText.bind(this)}>テキストをついか</button>
          <button style={style.button} onClick={this.onClickBackgroundChange.bind(this)}>バックをへんこう...</button>
          <button style={style.button} onClick={this.onClickSaveWithHalfSize.bind(this)}>ほぞん(640-480)</button>
          <button style={style.button} onClick={this.onClickSaveWithFullSize.bind(this)}>ほぞん(1280-960)</button>
          <input style={style.input} ref="input" type="file" onChange={this.onChangeFile.bind(this)} />
        </div>
      </section>
    );
  }

}

export default CanvasArea;
