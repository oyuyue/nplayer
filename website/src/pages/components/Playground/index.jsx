import React, { useEffect, useRef } from 'react';
import Player, { EVENT } from 'nplayer'
import Danmaku from '@nplayer/danmaku'
import Hls from 'hls.js'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Translate from '@docusaurus/Translate';
import M1 from '@site/static/img/M1.jpg';
import M2 from '@site/static/img/M2.jpg';
import M3 from '@site/static/img/M3.jpg';
import styles from './styles.module.css';
import { danmakuItems } from '../../../utils'

const Playground = () => {

  const container = useRef()
  // const mini = useRef()

  const locale = useDocusaurusContext()?.i18n?.currentLocale || ''
  const isEN = locale.includes('en')

  useEffect(() => {

    if (typeof document === 'undefined') return;

    const Quantity = {
      el: document.createElement('div'),
      init(player) {
        this.btn = document.createElement('div')
        this.btn.textContent = isEN ? 'Quantity': '画质'
        this.el.appendChild(this.btn)
        this.popover = new player.Player.components.Popover(this.el)
        this.btn.addEventListener('click', () =>  this.popover.show())
        this.el.style.display = 'none'
        this.el.classList.add(styles.Quantity)
      }
    }

    const player = new Player({
      plugins: [new Danmaku({ items: danmakuItems })],
      thumbnail: {
        startSecond: 1,
        images: [M1, M2, M3]
      },
      i18n: locale,
      volumeVertical: true,
      controls: [
        ['play', 'volume', 'time', 'spacer', Quantity, 'airplay', 'settings', 'web-fullscreen', 'fullscreen'],
        ['progress']
      ],
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
          el.classList.add(styles.QuantityItem)
          el.addEventListener('click', listener(i))
          frag.appendChild(el)
          return el;
        })
        const el = document.createElement('div')
        el.textContent = isEN ? 'Auto' : '自动'
        el.addEventListener('click', listener(-1))
        el.classList.add(styles.QuantityItem)
        frag.appendChild(el)
        Quantity.itemElements.push(el)

        Quantity.popover.panelEl.appendChild(frag);
        Quantity.el.style.display = 'block';

        listener(hls.currentLevel)(true)
      })
      hls.loadSource('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8')
    })

    hls.attachMedia(player.video)
    player.mount(container.current);

    // const interObserver = new IntersectionObserver((entries) => {
    //   player.mount(entries[0].isIntersecting ? container.current : mini.current)
    // }, {
    //   root: null,
    //   threshold: 0
    // })

    // interObserver.observe(player.el);

    return () => {
      hls.destroy()
      player.dispose()
      // interObserver.disconnect()
    }
  }, [])

  return (
    <div className={styles.Container} id="demo">
      <div className={styles.Title}><Translate id="nplayer.demo">演示</Translate></div>
      <div>
        <div className={styles.VideoContainer} ref={container}></div>
        <div className={styles.Tip}><Translate id="nplayer.demoTip">* 外网视频可能需要翻墙才能访问，拖动播放器👉右下角可以改变播放器尺寸。</Translate></div>
      </div>
      <div>
        <a href="https://codesandbox.io/s/nplayer-demo-ujtms" target="_blank"><img src="img/csb.png" /></a>
        <a href="https://codesandbox.io/s/nplayer-demo-ujtms" target="_blank"><img src="https://codesandbox.io/static/img/play-codesandbox.svg" /></a>
      </div>
      {/* <div className={styles.Mini}>
        <div className={styles.MiniHeader}></div>
        <div ref={mini}></div>
      </div> */}
    </div>
  );
};

export default Playground;
