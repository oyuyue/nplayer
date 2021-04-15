---
title: 视频镜像
---

这个功能我们使用 `switch` 类型的 `SettingItem` 来编写。

```js
const Mirroring = {
  type: 'switch',
  html: '视频镜像',
  checked: false,
  init(player) {
    player.video.classList.remove('nplayer_video-mirroring')
    // 默认不是镜像
  },
  change(value, player) {
    player.video.classList.toggle('nplayer_video-mirroring', value)
    // 通过添加移除 class 来让视频是否是镜像
  }
}

const player = new Player({
  settings: [Mirroring, 'speed']
})
player.mount(document.body)
```

CSS 代码如下。

```css
.nplayer_video-mirroring {
  transform: scaleX(-1);
}
```
