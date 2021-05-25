---
title: 海报
---

通过 `poster` 参数可以给视频添加海报，它是海报图片的链接。

```js
new Player({
  poster: 'http://image.jpg',
  posterEnable: true,
  // posterPlayEl
  // posterBgColor
})
```

NPlayer 的海报由两个元素组成，海报图片和播放按钮。播放按钮和海报背景色（默认是透明色）都可以自定义，具体详情请查看 [定制主题](theme.md)。

`posterEnable` 参数用来启用和禁用海报，默认是 `true`。

## Poster

还可以使用 `player.poster` 访问 Poster 对象，来控制海报的显示隐藏。

```js
const player = new Player()

player.poster.show()
player.poster.hide()
console.log(player.poster.isActive) // 是否在展示海报
```
