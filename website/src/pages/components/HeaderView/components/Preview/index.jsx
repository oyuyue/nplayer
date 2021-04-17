import React, { useCallback } from 'react';
import styles from './styles.module.css';

const Preview = () => {

  const toDemo = useCallback(() => {
    const demo = document.querySelector('#demo')
    if (demo) {
      demo.scrollIntoView()
    }
  }, [])

  return (
    <div className={styles.Container} onClick={toDemo}>
      <img className={styles.Img} src="img/preview.jpg" />
      <div className={styles.Text}>点击 👆 在线预览</div>
    </div>
  );
};

export default Preview;
