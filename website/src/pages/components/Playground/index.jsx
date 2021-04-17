import React, { useEffect, useRef } from 'react';
import Player from 'nplayer'
import Danmaku from '@nplayer/danmaku'
import Hls from 'hls.js'
import styles from './styles.module.css';
import items from './items'

const Playground = () => {

  const container = useRef()

  useEffect(() => {
    const danmaku = new Danmaku({
      items
    })
    const player = new Player({
      plugins: [danmaku]
    })

    const hls = new Hls();
    hls.attachMedia(player.video)
    hls.on(Hls.Events.MEDIA_ATTACHED, function () {
      hls.loadSource('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8')
    })

    player.mount(container.current);
  }, [])

  return (
    <div className={styles.Container}>
      <div className={styles.Title}>演示</div>
      <div>
        <div ref={container}></div>
      </div>
    </div>
  );
};

export default Playground;
