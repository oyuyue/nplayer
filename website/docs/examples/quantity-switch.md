---
title: 清晰度切换
---

```js
import Player from 'nplayer'
import Hls from 'hls'

// 1. 首先创建一个控制条项
const QuantitySwitch = {
  init(container, player) {
    this.element = container.appendChild(document.createElement('div'))
    this.btn = document.createElement('div')
    this.btn.textContent = '画质'
    this.element.appendChild(this.btn)
    this.popover = new player.Player.components.Popover(this.element) 
    this.btn.addEventListener('click', (ev) => {
      this.popover.show() 
      // 点击按钮的时候展示 popover
    })
    this.element.style.display = 'none'
    // 默认隐藏，因为有可能当前视频没有多个清晰度
    this.element.classList.add('quantity')
  }
}

// 2. 我们把它放到 airplay 后面
const player = new Player({
  controls: ['play', 'volume', 'time', 'spacer', 'airplay', QuantitySwitch, 'settings', 'web-fullscreen', 'fullscreen'],
})

// 3. 创建 HLS 实例
const hls = new Hls()
hls.attachMedia(player.video)

hls.on(Hls.Events.MEDIA_ATTACHED, function () {
  // 绑定 video 元素成功的时候，去加载视频
  hls.loadSource('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8')
  hls.on(Hls.Events.MANIFEST_PARSED, function () {
    if (hls.levels.length <= 1) {
      // 只有一个清晰度的时候隐藏 切换按钮
      QuantitySwitch.element.style.display = 'none'
      return
    }
    // 4. 给清晰度排序，清晰度越高的排在最前面
    hls.levels.sort((a, b) => b.height - a.height)
    const frag = document.createDocumentFragment();
    // 5. 给与清晰度对应的元素添加，点击切换清晰度功能
    const listener = (i) => (init) => {
      const el = QuantitySwitch.itemElements[i] || QuantitySwitch.itemElements[QuantitySwitch.itemElements.length - 1]
      if (el) {
        QuantitySwitch.btn.textContent = el.textContent 
        // 将展开清晰度按钮换成当前选择清晰度
        if (init !== true && !player.paused) setTimeout(() => player.play())
        // 因为 HLS 切换清晰度会使正在播放的视频暂停，我们这里让它再自动恢复播放
        hls.currentLevel = i;
        hls.loadLevel = i;
        // 设置 hls 当前清晰度
      }
      QuantitySwitch.popover.hide();
      // 隐藏清晰度选择菜单项目
    }
    // 6. 添加清晰度对应元素
    QuantitySwitch.itemElements = hls.levels.map((l, i) => {
      const el = document.createElement('div')
      el.textContent = l.name + 'P'
      if (l.height === 1080) el.textContent += ' 超清'
      if (l.height === 720) el.textContent += ' 高清'
      if (l.height === 480) el.textContent += ' 清晰'
      el.classList.add('quantity_item')
      el.addEventListener('click', listener(i))
      frag.appendChild(el)
      return el;
    })
    // 将清晰度添加 popover 中
    const el = document.createElement('div')
    el.textContent = '自动'
    el.addEventListener('click', listener(-1))
    el.classList.add('quantity_item')
    // 这里再添加一个 `自动` 选项，HLS 默认是根据网速自动切换清晰度
    frag.appendChild(el)
    QuantitySwitch.itemElements.push(el)

    QuantitySwitch.popover.panelElement.appendChild(frag);
    QuantitySwitch.element.style.display = 'block';
    // 显示该控制项

    listener(hls.currentLevel)(true)
    // 初始化当前清晰度
  });
});
```
