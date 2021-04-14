import React from 'react';
import styles from './styles.module.css';

const Preview = () => {
  return (
    <div className={styles.Container}>
      <img className={styles.Img} src="img/preview.jpg" />
      <div className={styles.Text}>点击 👆 在线预览</div>
    </div>
  );
};

export default Preview;
