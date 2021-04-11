import React from 'react';
import styles from './styles.module.css';


const MouseScroller = () => {
  return (
    <div className={styles.MouseContainer}>
      <div className={styles.Mouse}>
        <span className={styles.MouseWheel} />
      </div>
    </div>
  );
};

export default MouseScroller;