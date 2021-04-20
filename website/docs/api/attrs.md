---
title: 属性
---

NPlayer 属性分为实例属性和静态属性。

## 实例属性

```js
const player = new Player()
console.log(player)
```

你可以通过 `player` 对象来访问这些属性。

### element: HTMLElement

播放器 DOM 元素。

### opts: PlayerOptions

播放器参数。

### video: HTMLVideoElement

播放器视频元素。

### mounted: boolean

播放器是否已挂载。

### rect: Rect

播放器尺寸。

- rect.width 播放器宽度
- rect.height 播放器高度
- rect.x 播放器 x
- rect.y 播放器 y
- rect.update() 更新播放器尺寸

一般情况不要调用 `player.rect.update()` 方法，而是触发 `UpdateSize` 事件， `player.emit('UpdateSize')` 。

### loading: Loading

播放器 loading 对象。

- loading.element loading DOM 元素
- loading.isActive 当前是否显示
- loading.show() 显示 loading
- loading.hide() 隐藏 loading

### poster: Poster

播放器海报对象。

- poster.element poster DOM 元素
- poster.isActive 当前是否显示
- poster.show() 显示 poster
- poster.hide() 隐藏 poster

### toast: Toast

播放器提示对象。

- show(html: string, position?: Position, timeout = 3000): ToastItem 显示一个提示，返回提示对象

```typescript
type Position = 'center' | 'left-top' | 'right-top' | 'left-bottom' | 'right-bottom'
interface ToastItem {
  element: HTMLElement;
  dispose: () => void;
}
```

- close(toastItem?: ToastItem): void 手动关闭一个提示，或者全部提示

### fullscreen: Fullscreen

播放器全屏对象。

- isActive 当前是否是全屏状态
- enableDblclick() 启用双击进入全屏
- disableDblclick() 禁用双击进入全屏
- enter() 进入全屏
- exit() 退出全屏
- toggle() 进入或退出全屏

### webFullscreen: WebFullscreen

播放器网页全屏对象。

- isActive 当前是否是全屏状态
- enter() 进入全屏
- exit() 退出全屏
- toggle() 进入或退出全屏

### shortcut: Shortcut

播放器快捷键对象。

- register(keyCode: number, handler: (player: Player) => void) 注册自定义快捷键处理器
- unregister(keyCode: number) 取消注册
- enable() 启用快捷键
- disable() 禁用快捷键

### control: Control

播放器进度条对象。

- isActive 当前是否显示控制条
- show() 显示控制条
- hide() 隐藏控制条
- showTransient() 显示控制条，但是到一定时间会尝试自动隐藏
- tryHide() 尝试隐藏控制条，比如当前视频暂停状态，调用该方法就不会隐藏
- require() 添加一个控制条显示请求，`tryHide` 会判断是否有请求，如果则也不会隐藏
- release() 释放一个请求，如果调用 `require`，没有调用该方法，则可能导致控制条不会自动隐藏。

### contextmenu: ContextMenu

播放器右键菜单。

- isActive 当前是否显示
- hide() 隐藏右键菜单

### currentTime: number [get/set]

获取和设置当前视频时间。

### duration: number [get]

获取当前视频长度。

### buffered: TimeRanges [get]

通 video 元素的 [buffered](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/buffered)。

### volume: number [get/set]

获取和设置视频音量，音量会被持久化。

### muted: boolean [get/set]

获取和设置视频是否静音。

### playbackRate: number [get/set]

获取和设置视频播放速率。

### ended: boolean [get]

当前视频是否播放结束。

### paused: boolean [get]

当前视频是否暂停。

### playing: boolean [get]

当前视频是否在播放中。

### loop: boolean [get/set]

获取和设置视频是否循环播放。

### Player

Player 类。

### EVENT

事件对象。详情请查看 [事件](api/events.md)。

## 静态属性

```js
import Player from 'nplayer'
console.log(Player)
```

### EVENT

事件对象。详情请查看 [事件](api/events.md)。

### I18n

国际化对象。

- t(key: string, lang?: string): string 返回翻译语言文字
- add(lang: string, transData: Record<string, string>) 添加翻译
- setCurrentLang(lang?: string) 设置当前语言
- setDefaultLang(lang?: string) 设置默认语言

```js
const key = 'Web fullscreen'

I18n.add('zh-cn', {
  [key]: '网页全屏'
})

console.log(I18n.t(key))
```

如果当前是中文环境时会返回 `网页全屏`。其他语言环境时则直接返回 `key` 字符串。

### Icon

图标对象。详情请查看 [定制主题](theme.md)。

### components

内置组件。详情请查看 [内置组件](api/components.md)。

### Player

Player 类。
