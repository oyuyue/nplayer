---
title: 海报
---

通过 `poster` 参数可以给视频添加海报，它是海报图片的链接。

```js
new Player({
  poster: 'http://image.jpg'
})
```

NPlayer 的海报由两个元素组成，一个是海报图片，一个是上面的播放按钮。播放按钮和海报背景色（默认是透明色）都可以自定义，具体详情可以查看的 [定制主题章节](theme.md)。

## Poster

还可以使用 `player.poster` 访问 Poster 对象，来控制海报的显示隐藏。

```js
const player = new Player()

player.poster.show()
player.poster.hide()
```
