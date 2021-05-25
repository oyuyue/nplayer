---
title: 视频截图
---

这里使用右键菜单的形式实现视频截图功能。

```js
import Player from 'nplayer'

const Screenshot = {
  html: '截图',
  click(player) {
    const canvas = document.createElement('canvas')
    canvas.width = player.video.videoWidth
    canvas.height = player.video.videoHeight
    canvas.getContext('2d').drawImage(player.video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob((blob) => {
        let dataURL = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = dataURL
        link.download = 'NPlayer.png'
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(dataURL)
    })
  }
}

const player = new Player({
  contextMenus: [Screenshot, 'loop', 'pip', 'version']
})
player.mount(document.body)
```
