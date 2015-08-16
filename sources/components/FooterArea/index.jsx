import Radium from 'radium';
import React from 'react';

import style from './style';

@Radium
class FooterArea extends React.Component {

  render() {
    return (
      <section style={style.section}>
        <div style={style.div}>
          <dl style={{margin: '0 auto 1rem auto'}}>
            <dt style={style.dt}>すいしょうブラウザ</dt>
            <dd style={style.dd}>
              <a key="a.1"style={style.a} href="https://www.google.co.jp/chrome/browser/desktop/">グーグル クローム</a>
            </dd>
            <dd style={style.dd}>
              <a key="a.2" style={style.a} href="https://www.mozilla.org/ja/firefox/new/">モジラ ファイアフォックス</a>
            </dd>
          </dl>
        </div>
        <div style={style.div}>
          <ul style={style.ul}>
            <li style={style.li}>このページは個人で運営しているものであり、任天堂株式会社とは一切関係ありません。</li>
            <li style={style.li}>このページを利用したことにより発生した損害について、作成者は責任を負いません。</li>
          </ul>
        </div>
        <p style={style.p}>
          <small style={style.small}>
            <a key="a.3" style={style.a} href="http://ikazukuri.sasaplus1.com/">イカヅクリ</a>
            &copy;
            <a key="a.4" style={style.a} href="http://www.sasaplus1.com/">ささぷらすいち</a>
            <span style={style.span}>-</span>
            <a key="a.5" style={style.a} href="http://aramugi.com/?page_id=807">イカモドキ</a>
            &copy;
            <a key="a.6" style={style.a} href="http://aramugi.com/">あらむぎ</a>
          </small>
        </p>
      </section>
    );
  }

}

export default FooterArea;
