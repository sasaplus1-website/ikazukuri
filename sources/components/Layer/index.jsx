import Radium from 'radium';
import React from 'react';

import LayerAction from '../../actions/LayerAction';

import CommonStyle from '../../style';

import style from './style';

@Radium
class Layer extends React.Component {

  static propTypes = {
    index: React.PropTypes.number,
    id: React.PropTypes.number.isRequired,
    order: React.PropTypes.number.isRequired,
    text: React.PropTypes.string,
    size: React.PropTypes.number,
    x: React.PropTypes.number,
    y: React.PropTypes.number,
    color: React.PropTypes.string,
    style: React.PropTypes.string,
  };

  static defaultProps = {
    index: 0,
    id: 0,
    order: 0,
    text: '',
    size: 0,
    x: 0,
    y: 0,
    color: '',
    style: 'stroke',
  };

  state = {
    id: this.props.id,
    order: this.props.order,
    text: this.props.text,
    size: this.props.size,
    x: this.props.x,
    y: this.props.y,
    color: this.props.color,
    style: this.props.style,
  };

  //----------------------------------------------------------------------------

  onChangeText(event) {
    log('Layer#onChangeText', event);

    this.setState({
      text: event.target.value,
    }, function() {
      LayerAction.update(this.state);
    });
  }

  onChangeX(event) {
    log('Layer#onChangeX', event);

    let x = parseInt(event.target.value, 10);

    if (!Number.isFinite(x)) {
      x = 0;
    }

    this.setState({
      x,
    }, function() {
      LayerAction.update(this.state);
    });
  }

  onChangeY(event) {
    log('Layer#onChangeY', event);

    let y = parseInt(event.target.value, 10);

    if (!Number.isFinite(y)) {
      y = 0;
    }

    this.setState({
      y,
    }, function() {
      LayerAction.update(this.state);
    });
  }

  onChangeSize(event) {
    log('Layer#onChangeSize', event);

    let size = parseInt(event.target.value, 10);

    if (!Number.isFinite(size)) {
      size = 0;
    }

    this.setState({
      size,
    }, function() {
      LayerAction.update(this.state);
    });
  }

  onChangeColor(event) {
    log('Layer#onChangeColor', event);

    this.setState({
      color: event.target.value,
    }, function() {
      LayerAction.update(this.state);
    });
  }

  onChangeStyle(event) {
    log('Layer#onChangeStyle', event);

    this.setState({
      style: event.target.value,
    }, function() {
      LayerAction.update(this.state);
    });
  }

  onClickRemove(event) {
    log('Layer#onClickRemove', event);

    LayerAction.remove(this.state);
  }

  //----------------------------------------------------------------------------

  render() {
    return (
      <section style={[style.section, (this.props.index % 2 === 0) ? style.even : null]}>
        <div>
          <label>
            <span style={style.span}>テキスト</span>
            <input style={style.text} type="text" size="10" value={this.state.text} onChange={this.onChangeText.bind(this)} />
          </label>
          <label>
            <span style={style.span}>タテ</span>
            <input style={style.number} type="number" min="0" max="1280" step="1" value={this.state.y} onChange={this.onChangeY.bind(this)} />
          </label>
          <label>
            <span style={style.span}>スタイル</span>
            <select value={this.state.style} onChange={this.onChangeStyle.bind(this)}>
              <option value="fill">フィル</option>
              <option value="stroke">ストローク</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            <span style={style.span}>カラー</span>
            <input style={[style.text, style.color]} type="text" size="10" value={this.state.color} onChange={this.onChangeColor.bind(this)} />
          </label>
          <label>
            <span style={style.span}>ヨコ</span>
            <input style={style.number} type="number" min="0" max="1280" step="1" value={this.state.x} onChange={this.onChangeX.bind(this)} />
          </label>
          <label>
            <span style={style.span}>サイズ</span>
            <input style={style.number} type="number" min="0" max="1000" step="1" value={this.state.size} onChange={this.onChangeSize.bind(this)} />
          </label>
          <button style={style.remove} onClick={this.onClickRemove.bind(this)}>けす</button>
          <div style={CommonStyle.clearfix}></div>
        </div>
      </section>
    );
  }

}

export default Layer;
