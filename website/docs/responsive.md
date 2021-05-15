---
title: 响应式/多设备
---

NPlayer 支持移动、平板和桌面。还可以自定义任意多个不同的断点。NPlayer 中的交互和布局是分离的。

## 触屏交互

一般我们在手机上看视频，单击视频会显示控制条，双击是播放暂停视频，左右滑动可以快进或快退视频。而在电脑上单击视频是播放暂停，双击是全屏，键盘上的左右快捷键可以快进快退视频。

NPlayer 支持上面提到的两套交互，可以通过 `isTouch` 参数来设置播放器是使用哪一套交互，默认情况下会自动检测是否是触屏，如果是将使用触屏交互逻辑否则使用鼠标键盘形式的交互。

```js
import Player from 'nplayer'

const player = new Player({
  isTouch: true // 默认会自动检测
})
```

## 自定义断点布局

通过 `bpControls` 参数可以自定义任意多个控制条布局。它的默认值如下。

```js
import Player from 'nplayer'

const player = new Player({
  bpControls: { // 默认值
    650: [
      ['play', 'progress', 'time', 'web-fullscreen', 'fullscreen'],
      [],
      ['spacer', 'airplay', 'settings'],
    ]
  }
})
```

这个默认参数的意思是，当播放器的尺寸小于等于 `650px` 使用这套控制条布局。（如果你不知道为什么是一个二维数组请查看 [控制条章节](control.md)）

你可以自定义添加任意多个断点。

```js
{
  bpControls: {
    100: [[], [], []], // <= 100px 使用这套
    200: [[], [], []], // <= 200px 使用这套
    300: [[], [], []], // <= 300px 使用这套
  },
  controls: [[],[],[]] // 其他情况下使用这个
}
```

如果没有匹配到 `bpControls` 中定义的布局，则会使用 `controls` 中的默认布局。

当每次布局变化时，播放器还会触发 `BpChange` 事件，你可以监听该事件做一些布局切换时的操作。

当然也可以通过调用 API 方法来自己手动更新布局，更多控制条布局请查看[控制条章节](control.md)。
