---
title: 方法
---

NPlayer 实例方法如下。

```js
const player = new Player()
console.log(player)
```

### `mount(container?: HTMLElement | string): void`

挂载 `player` 到 DOM 中。如果初始化时没有传入 `container` 参数，那么调用该函数时的参数为必传。

### `incVolume(v = this.opts.volumeStep): void`

递增音量，步长为 `volumeStep` 设置的值。

### `decVolume(v = this.opts.volumeStep): void`

递减音量，步长为 `volumeStep` 设置的值。

### `toggleVolume(): void`

恢复或静音音量。

### `forward(v = this.opts.seekStep): void`

快进，步长为 `seekStep` 设置的值。

### `rewind(v = this.opts.seekStep): void`

快退，步长为 `seekStep` 设置的值。

### `play(): Promise<void> | void`
  
播放视频，对一些老浏览器可能什么都不返回。详情请查看 [这里](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play)。

### `pause(): void`

暂停视频。

### `toggle(): void`

播放或暂停视频。

### `seek(seconds: number): void`

视频跳转到指定事件。

### `use(plugin: Plugin): this`

安装插件。

### `updateControlItems(items: (string | ControlItem)[], index?: number): void`

更新控制条项，默认 `index` 是 `0`，也就是最下面一行。详情请查看 [控制条章节](control.md)。

### `registerSettingItem(item: SettingItem, id?: string): void`

注册设置项，详情请查看 [插件](plugin.md)。

### `registerContextMenuItem(item: ContextMenuItem, id?: string): void`

注册右键菜单项，详情请查看 [插件](plugin.md)。

### `registerControlItem(item: ControlItem, id?: string): void`

注册控制条项，详情请查看 [插件](plugin.md)。

### `getSettingItem(id: string): SettingItem | null`

获取指定设置项，详情请查看 [设置菜单](settings.md)。

### `getContextMenuItem(id: string): ContextMenuItem | null`

获取指定右键菜单项，详情请查看 [右键菜单](contextmenu.md)。

### `getControlItem(id: string): ControlItem | null`

获取指定控制条项，详情请查看 [控制条](control.md)。

### `updateOptions(opts: PlayerOptions): void`

更新播放器参数，详情请查看 [快速开始](getting-started.md)。

### `disableClickPause(): void`

禁用单击播放/暂停视频。

### `enableClickPause(): void`

启用单击播放/暂停视频。

### `dispose(): void`

销毁播放器对象。
