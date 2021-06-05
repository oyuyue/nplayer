import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Translate from '@docusaurus/Translate';
import CodeBlock from '../../../components/CodeBlock'
import PrimaryButton from '../../../components/PrimaryButton';
import styles from './styles.module.css';

const code = `import Player from 'nplayer'

const player = new Player({
  src: "https://v-cdn.zjol.com.cn/280443.mp4",
})

player.mount(document.body)`

const StartCoding = () => {

  return (
    <div className={styles.Container}>
      <div className={styles.Content}>
        <div className={styles.Title}><Translate id="nplayer.quick">快速上手</Translate></div>
        <div>
          <div className={styles.Tagline}><Translate id="nplayer.quick1nd">第一步：安装 NPlayer</Translate></div>
          <CodeBlock code="npm i -S nplayer" />
        </div>
        <div>
          <div className={styles.Tagline}><Translate id="nplayer.quick2nd">第二步：使用 NPlayer</Translate></div>
          <CodeBlock code={code} />
        </div>
        <PrimaryButton
          className={styles.LearnMoreBtn}
          to={useBaseUrl('/docs/')}>
          <Translate id="nplayer.learnMore">了解更多</Translate>
        </PrimaryButton>
      </div>
    </div>
  );
};

export default StartCoding;
