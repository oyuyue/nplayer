---
title: 流媒体
---

NPlayer 可以非常方便的接入其他流媒体协议，如果想使用 HLS 可以去引入 [hls.js](https://github.com/video-dev/hls.js)。

```js
import Hls from 'hls'
import Player from 'player'

const hls = new Hls()
const player = new Player()
hls.attachMedia(player.video)

hls.on(Hls.Events.MEDIA_ATTACHED, function () {
  hls.loadSource('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8')
})

player.mount(document.body)
```

更多关于 hls.js 使用方法，请查看 [hls.js 官方文档](https://github.com/video-dev/hls.js) 。

hls 是视频点播很常用的协议，本教程还提供了使用 hls.js 实现清晰度切换功能，详情请查看 [清晰度切换](examples/quantity-switch) 。

### DASH

和 HLS 非常相似的是 DASH 协议，要使用 DASH 协议可以使用 dash.js 。

```js
import dash from 'dashjs'
import Player from 'player'

const player = new Player()

dash
  .MediaPlayer()
  .create()
  .initialize(
    player.video,
    'http://127.0.0.1:8001/out.mpd',
    true // 自动播放
  )
```

更多关于 dash.js 请查看 [dash.js 官方文档](https://github.com/Dash-Industry-Forum/dash.js) 。

### 任何流媒体

按照这个套路，其实任何这些流媒体都可以接入（flv, WebTorrent 等等）。因为它们只需要一个 `video` 元素就行，我们可以通过 `player.video` 属性访问到 `video` 元素。

除了让 NPlayer 自动创建 `video` 元素，还可以自己提供 `video` 元素。

```js
import Hls from 'hls'
import Player from 'player'

const video = document.createElement('video')
const hls = new Hls()
const player = new Player({ video })
hls.attachMedia(player.video)

hls.on(Hls.Events.MEDIA_ATTACHED, function () {
  hls.loadSource('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8')
})

player.mount(document.body)
```

只需提供 `video` 参数，`player.video` 就是你提供的 `video` 元素了。
