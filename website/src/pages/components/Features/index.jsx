import React from 'react';
import clsx from 'clsx';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const Features = () => {
  const videoUrl = useBaseUrl('img/nplayer.mp4');
  const customUrl = useBaseUrl('img/custom.jpg');
  const contextUrl = useBaseUrl('img/context.jpg')

  return (
    <div className={styles.Container}>
      <div className={styles.Content}>
        <section className={styles.features}>
          <div className="container">
            <div className={styles.feature}>
              <div className={styles.featureText}>
                <h3 className={styles.featureTitle}>响应式</h3>
                <div>支持手机、平板、桌面电脑，并且可以自定义任意多个断点，不仅仅是兼容移动端。</div>
              </div>
              <video className={styles.featureImgContainer} src={videoUrl} muted autoPlay preload="auto" loop />
            </div>
            <div className={styles.feature} style={{ flexWrap: 'wrap' }}>
              <img className={styles.featureImgContainer} src={customUrl} />
              <div className={styles.featureText}>
                <h3 className={styles.featureTitle}>可定制</h3>
                <div>可轻松配置控制条、上下文菜单、设置和定制主题，并提供了内置组件方便二次开发。</div>
              </div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureText}>
                <h3 className={styles.featureTitle}>多功能</h3>
                <div>弹幕、全屏、网页全屏、快捷键、画中画、隔空播放、速度控制、上下文菜单、视频缩略图、国际化等等。</div>
              </div>
              <img className={styles.featureImgContainer} src={contextUrl} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Features;
