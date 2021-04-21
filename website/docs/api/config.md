---
title: 参数
---

播放器构造函数参数。

## 参数签名

```typescript
interface PlayerOptions {
  el?: HTMLElement | string;
  src?: string;
  video?: HTMLVideoElement;
  videoAttrs?: Record<string, any>;
  videoSources?: VideoSource[];
  thumbnail?: ThumbnailOptions;
  controls?: (ControlItem | string)[];
  settings?: (SettingItem | string)[];
  contextMenus?: (ContextMenuItem | string)[];
  contextMenuToggle?: boolean;
  plugins?: Plugin[];
  shortcut?: boolean;
  seekStep?: number;
  volumeStep?: number;
  themeColor?: string;
  posterBgColor?: string;
  progressBg?: string;
  volumeProgressBg?: string;
  volumeBarWidth?: number | string;
  loadingElement?: HTMLElement;
  openEdgeInIE?: boolean;
  poster?: string;
  posterEnable?: boolean;
  posterPlayElement?: HTMLElement;
  dblclickFullscreen?: boolean;
  clickPause?: boolean;
  [key: string]: any;
}
```

## 描述

| 参数 | 描述 |
| --- | --- |
| el | 播放器挂载容器元素，同 `mount` 方法参数，如果 `mount` 没有传入参数时，将使用该参数 |
| src | 视频地址 |
| video | 自己提供 video 元素 |
| videoAttrs | video 元素的属性 |
| videoSources| video source 子元素数组，请查看 [快速开始](getting-started.md) |
| thumbnail | 请查看 [预览缩略图](thumbnail.md) |
| controls | 请查看 [控制条](control.md) |
| settings | 请查看 [设置菜单](settings.md) |
| contextMenus | 请查看 [右键菜单](contextmenu.md) |
| contextMenuToggle | 是否偶数次单击右键时显示浏览器默认右键菜单 |
| plugins | 插件列表，详情请查看 [插件](plugin.md) |
| shortcut | 是否开启快捷键功能 |
| seekStep | 单次快进、快退的步长，快捷键中会使用到 |
| volumeStep | 单次增加、降低音量的步长，快捷键中会使用到 |
| themeColor | 主题色，请查看 [定制主题](theme.md) |
| posterBgColor | 海报背景色，请查看 [定制主题](theme.md) |
| progressBg | 进度条背景，请查看 [定制主题](theme.md) |
| volumeProgressBg | 音量条背景，请查看 [定制主题](theme.md) |
| volumeBarWidth | 音量条宽度，请查看 [定制主题](theme.md) |
| loadingElement | 自定义视频 loading 元素，请查看 [定制主题](theme.md) |
| openEdgeInIE | 是否在 Win10 的 IE 中自动打开 Edge，请查看 [IE 11 兼容](ie11.md) |
| poster | 海报图片地址，请查看 [海报](poster.md) |
| posterEnable | 是否启用海报功能 |
| posterPlayElement | 自定义海报播放按钮，请查看 [定制主题](theme.md) |
| dblclickFullscreen | 是否双击进入全屏 |
| clickPause | 是否单击播放、暂停视频 |

## 默认参数

```js
{
  shortcut: true,
  seekStep: 10,
  volumeStep: 0.1,
  volumeBarWidth: 100,
  controls: ['play', 'volume', 'time', 'spacer', 'airplay', 'settings', 'web-fullscreen', 'fullscreen'],
  settings: ['speed'],
  contextMenus: ['loop', 'pip', 'version'],
  contextMenuToggle: true,
  openEdgeInIE: true,
  posterEnable: true,
  clickPause: true,
  dblclickFullscreen: true,
  videoAttrs: {
    crossorigin: 'anonymous',
    preload: 'auto',
    playsinline: 'true',
  },
}
```
自定义参数会覆盖默认参数，但是 `videoAttrs` 不会被覆盖，而是被合并。
