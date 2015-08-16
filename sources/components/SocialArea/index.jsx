import Radium from 'radium';
import React from 'react';

import style from './style';

@Radium
class SocialArea extends React.Component {

  addHatenaBookmarkScript() {
    log('SocialArea#addHatenaBookmarkScript');

    let script = document.createElement('script');

    script.async = true;
    script.charset = 'utf-8';
    script.src = 'https://b.st-hatena.com/js/bookmark_button.js';

    document.getElementsByTagName('head')[0].appendChild(script);
  }

  addGitHubButtonsScript() {
    log('SocialArea#addGitHubButtonsScript');

    let script = document.createElement('script');

    script.id = 'github-bjs';
    script.async = true;
    script.defer = true;
    script.src = 'https://buttons.github.io/buttons.js';

    document.getElementsByTagName('head')[0].appendChild(script);
  }

  addTwitterScript() {
    log('SocialArea#addTwitterScript');

    let script = document.createElement('script');

    script.id = 'twitter-wjs';
    script.async = true;
    script.src = '//platform.twitter.com/widgets.js';

    document.getElementsByTagName('head')[0].appendChild(script);
  }

  //----------------------------------------------------------------------------

  componentDidMount() {
    this.addHatenaBookmarkScript();
    this.addGitHubButtonsScript();
    this.addTwitterScript();
  }

  //----------------------------------------------------------------------------

  render() {
    return (
      <section style={style.section}>
        <div style={style.div} dangerouslySetInnerHTML={
          {
            __html: `
              <a
                class="twitter-share-button"
                href="https://twitter.com/share"
                data-url="http://ikazukuri.sasaplus1.com"
                data-text="イカヅクリ">Tweet</a>
              <a
                class="hatena-bookmark-button"
                href="http://b.hatena.ne.jp/entry/ikazukuri.sasaplus1.com"
                data-hatena-bookmark-title="イカヅクリ"
                data-hatena-bookmark-layout="standard-balloon"
                data-hatena-bookmark-lang="ja"
                title="このエントリーをはてなブックマークに追加">
                <img
                  src="https://b.st-hatena.com/images/entry-button/button-only@2x.png"
                  alt="このエントリーをはてなブックマークに追加"
                  width="20"
                  height="20"
                  style="border: none;"></a>
              <a
                class="github-button"
                href="https://github.com/sasaplus1/ikazukuri"
                data-count-href="/sasaplus1/ikazukuri/stargazers"
                data-count-api="/repos/sasaplus1/ikazukuri#stargazers_count"
                data-count-aria-label="# stargazers on GitHub"
                aria-label="Star sasaplus1/ikazukuri on GitHub">Star</a>
            `
          }
        }>
        </div>
      </section>
    );
  }

}

export default SocialArea;
