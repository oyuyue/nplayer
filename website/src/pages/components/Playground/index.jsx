import React, { useEffect, useRef } from 'react';
import Player, { EVENT } from 'nplayer'
import Danmaku from '@nplayer/danmaku'
import Hls from 'hls.js'
import M1 from '@site/static/img/M1.jpg';
import M2 from '@site/static/img/M2.jpg';
import M3 from '@site/static/img/M3.jpg';
import styles from './styles.module.css';
import { danmakuItems } from '../../../utils'

const Playground = () => {

  const container = useRef()

  useEffect(() => {

    if (typeof document === 'undefined') return;

    const Quantity = {
      element: document.createElement('div'),
      init(player) {
        this.btn = document.createElement('div')
        this.btn.textContent = '画质'
        this.element.appendChild(this.btn)
        this.popover = new player.Player.components.Popover(this.element)
        this.btn.addEventListener('click', () =>  this.popover.show())
        this.element.style.display = 'none'
        this.element.classList.add(styles.Quantity)
      }
    }

    const player = new Player({
      plugins: [new Danmaku({ items: danmakuItems })],
      thumbnail: {
        startSecond: 1,
        images: [M1, M2, M3]
      },
      controls: ['play', 'volume', 'time', 'spacer', Quantity, 'airplay', 'settings', 'web-fullscreen', 'fullscreen'],
    })

    player.on(EVENT.WEB_ENTER_FULLSCREEN, () => { document.body.style.overflow = 'hidden' })
    player.on(EVENT.WEB_EXIT_FULLSCREEN, () => { document.body.style.overflow = '' })

    const hls = new Hls();
    hls.on(Hls.Events.MEDIA_ATTACHED, function () {
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        hls.levels.sort((a, b) => b.height - a.height)
        const frag = document.createDocumentFragment()
        const listener = (i) => (init) => {
          const last = Quantity.itemElements[Quantity.itemElements.length - 1]
          const prev = Quantity.itemElements[Quantity.value] || last
          const el = Quantity.itemElements[i] || last
          prev.classList.remove(styles.QuantityItemActive)
          el.classList.add(styles.QuantityItemActive)
          Quantity.btn.textContent = el.textContent
          if (init !== true && !player.paused) setTimeout(() => player.play())
          if (init === true) {
            Quantity.value = i
          } else {
            Quantity.value = hls.currentLevel = hls.loadLevel = i;
          }
          Quantity.popover.hide();
        }
        Quantity.itemElements = hls.levels.map((l, i) => {
          const el = document.createElement('div')
          el.textContent = l.name + 'P'
          if (l.height === 1080) el.textContent += ' 超清'
          if (l.height === 720) el.textContent += ' 高清'
          if (l.height === 480) el.textContent += ' 清晰'
          el.classList.add(styles.QuantityItem)
          el.addEventListener('click', listener(i))
          frag.appendChild(el)
          return el;
        })
        const el = document.createElement('div')
        el.textContent = '自动'
        el.addEventListener('click', listener(-1))
        el.classList.add(styles.QuantityItem)
        frag.appendChild(el)
        Quantity.itemElements.push(el)

        Quantity.popover.panelElement.appendChild(frag);
        Quantity.element.style.display = 'block';

        listener(hls.currentLevel)(true)
      })
      hls.loadSource('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8')
    })

    hls.attachMedia(player.video)
    player.mount(container.current);

    if (player.rect.width < 575) {
      const danmaku = player.getControlItem('danmaku')
      const spacer = player.getControlItem('spacer')
      if (danmaku && danmaku.element) {
        danmaku.element.style.display = 'none';
      }
      if (spacer) {
        spacer.flex(1)
      }
    }

    return () => {
      hls.destroy()
      player.dispose()
    }
  }, [])

  return (
    <div className={styles.Container} id="demo">
      <div className={styles.Title}>演示</div>
      <div>
        <div className={styles.VideoContainer} ref={container}></div>
        <div className={styles.Tip}>* 外网视频可能需要翻墙才能访问，拖动播放器👉右下角可以改变播放器尺寸~</div>
      </div>
      <div>
        <a href="https://codesandbox.io/s/nplayer-demo-ujtms" target="_blank"><img src="img/csb.png" /></a>
        <a href="https://codesandbox.io/s/nplayer-demo-ujtms" target="_blank"><img src="https://codesandbox.io/static/img/play-codesandbox.svg" /></a>
      </div>
    </div>
  );
};

export default Playground;
