---
title: 迷你播放器
---

当我们向下滚动网页时，如果播放器消失在视口中，一般会出现一个 Mini 播放器在右下角播放视频。

在 NPlayer 中通过 `bpControls` 参数和 `mount()` 方法，可以非常轻松的实现这个 Mini 播放器功能。

```js
import Player from 'nplayer'

const videoContainer = document.querySelector('.video_container')
const miniContainer = document.querySelector('.mini_container')

const player = new Player({
  src: 'https://v-cdn.zjol.com.cn/280443.mp4',
  bpControls: {
    500: [
      ['play', 'progress', 'time'],
    ]
  }
})

const interObserver = new IntersectionObserver((entries) => {
  player.mount(entries[0].isIntersecting ? videoContainer : miniContainer)
}, {
  root: null,
  threshold: 0
})

interObserver.observe(videoContainer);
```

上面通过 `IntersectionObserver` API 来检测当前播放器是否在视口中可见，如果不可见就将播放器挂载到 Mini DOM 容器元素中。

上面省略了视频容器和 Mini 容器的 CSS 代码。我们假设 Mini 容器宽度是小于 500 的，所以当播放器挂载到 Mini 容器中，就会应用 `bpControls` 中 `500` 的布局，从而隐藏掉一些非必要的控制项。
