import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import PrimaryButton from '../../../components/PrimaryButton';
import GithubButton from '../../../components/GithubButton';
import styles from './styles.module.css';
import { useWindowSize } from '../../../hooks/useWindowSize';
import MouseScroller from './components/MouseScroller';
import Preview from './components/Preview';

const HeaderView = () => {
  const { siteConfig } = useDocusaurusContext();
  const { windowHeight } = useWindowSize();

  return (
    <div
      className={styles.Container}
      style={{ height: windowHeight > 800 ? windowHeight : undefined }}>
      <div style={{paddingBottom: '5rem'}}>
        <div className={styles.HeaderTitle}>RPlayer</div>
        <div className={styles.DescriptionText}>可定制、插件化、美观、实用的视频播放器</div>
        <div className={styles.ButtonContainer}>
          <PrimaryButton
            className={styles.GetStartedButton}
            to={'/docs/introduction'}>
            快速开始
          </PrimaryButton>
          <GithubButton
            className={styles.GithubButton}
            to={siteConfig.customFields.githubUrl}
          />
        </div>
      </div>
      <Preview />
      {windowHeight > 900 && windowHeight < 1200 && <MouseScroller />}
    </div>
  );
};

export default HeaderView;
