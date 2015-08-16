import Radium from 'radium';
import React from 'react';

import style from './style';

@Radium
class HeaderArea extends React.Component {

  render() {
    return (
      <section style={style.section}>
        <h1 style={style.h1}>
          <a style={style.a} href="./">イカヅクリ</a>
        </h1>
        <p style={style.p}>スプラトゥーンふうのポスターをつくってみなイカ？</p>
      </section>
    );
  }

}

export default HeaderArea;
