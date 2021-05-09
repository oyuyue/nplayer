import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import PrimaryButton from '../../../components/PrimaryButton';
import GithubButton from '../../../components/GithubButton';
import styles from './styles.module.css';
import { useWindowSize } from '../../../hooks/useWindowSize';
import MouseScroller from './components/MouseScroller';
import Preview from './components/Preview';

const HeaderView = () => {
  const { windowHeight } = useWindowSize();

  return (
    <div
      className={styles.Container}
      style={{ height: windowHeight > 800 ? windowHeight : undefined }}>
      <div className={styles.ContainerLeft}>
        <div className={styles.HeaderTitle}>NPlayer</div>
        <div className={styles.DescriptionText}>可定制、插件化、响应式（支持移动、平板等多种设备）的弹幕视频播放器</div>
        <div className={styles.ButtonContainer}>
          <PrimaryButton
            className={styles.GetStartedButton}
            to={useBaseUrl('/docs/')}>
            快速开始
          </PrimaryButton>
          <GithubButton
            className={styles.GithubButton}
            to={'https://github.com/woopen/nplayer'}
          />
        </div>
      </div>
      <Preview />
      {windowHeight > 900 && windowHeight < 1200 && <MouseScroller />}
    </div>
  );
};

export default HeaderView;
