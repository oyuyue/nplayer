---
title: 弹幕插件
---

该插件可以给 NPlayer 添加弹幕功能。它可以保持大量弹幕而不卡顿，该弹幕系统体验和性能与B站弹幕十分相似，支持非常多的设置，弹幕防碰撞、弹幕速度、字体、速度、透明度、显示区域、无限弹幕等。

## 安装

执行下面命令使用 npm 包的形式安装。

```bash
npm i -S @nplayer/danmaku
```

或者使用 CDN 的方式。

```html
<script src="https://unpkg.com/@nplayer/danmaku@latest/dist/index.min.js"></script>
```

## 快速上手

安装好后我们就可以使用弹幕插件啦。

```js
import Player from 'nplayer'
import DanmukuPlugin from '@nplayer/danmaku'

const danmakuOptions = {
  items: [
    { time: 1, text: '弹幕～' }
  ]
}

const player = new Player({
  plugins: [new DanmakuPlugin(danmakuOptions)]
})

player.mount(document.body)
```

## API
