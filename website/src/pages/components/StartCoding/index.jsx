import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
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
        <div className={styles.Title}>快速上手</div>
        <div>
          <div className={styles.Tagline}>第一步：安装 NPlayer</div>
          <CodeBlock code="npm i -S nplayer" />
        </div>
        <div>
          <div className={styles.Tagline}>第二步：使用 NPlayer</div>
          <CodeBlock code={code} />
        </div>
        <PrimaryButton
          className={styles.LearnMoreBtn}
          to={useBaseUrl('/docs/')}>
          了解更多
        </PrimaryButton>
      </div>
    </div>
  );
};

export default StartCoding;
