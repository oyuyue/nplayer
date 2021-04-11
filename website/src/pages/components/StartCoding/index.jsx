import React from 'react';
import CodeBlock from '../../../components/CodeBlock'
import PrimaryButton from '../../../components/PrimaryButton';
import styles from './styles.module.css';

const code = `import Player from 'rplayer'

const player = new Player({
  videoAttrs: { src: 'VIDEO_SRC' }
})

player.mount(document.body)`

const StartCoding = () => {

  return (
    <div className={styles.Container}>
      <div className={styles.Content}>
        <div className={styles.Title}>快速上手</div>
        <div>
          <div className={styles.Tagline}>第一步：安装 RPlayer</div>
          <CodeBlock code="npm i -S rplayer" />
        </div>
        <div>
          <div className={styles.Tagline}>第二步：使用 RPlayer</div>
          <CodeBlock code={code} />
        </div>
        <PrimaryButton
          className={styles.LearnMoreBtn}
          to={'/docs/introduction'}>
          更多用法
        </PrimaryButton>
      </div>
    </div>
  );
};

export default StartCoding;
