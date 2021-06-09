---
title: 参数
---

播放器构造函数参数。

```js
import Player from 'nplayer'

const player = new Player({
  // 这里
})

console.log(player.opts)
```

## 描述

| 参数 | 描述 |
| --- | --- |
| container | 播放器挂载容器元素，同 `mount` 方法参数，如果 `mount` 没有传入参数时，将使用该参数，当该参数为字符串时，将会自动查找对应元素 |
| src | 视频地址，同 `video` 元素的 `src` 属性 |
| video | 自己提供 video 元素 |
| videoProps | video 元素的属性 |
| videoSources| video source 子元素数组，请查看 [快速开始](getting-started.md) |
| live| 是否是直播模式 |
| autoSeekTime| 视频加载成功时自动跳转到的时间点（跳转后该参数会自动设为 0），你可以用这个参数实现记忆上次用户观看时间 |
| thumbnail | 请查看 [预览缩略图](thumbnail.md) |
| controls | 请查看 [控制条](control.md) |
| bpControls | 设置不同断点下的控制条项布局，请查看 [控制条](control.md) |
| settings | 请查看 [设置菜单](settings.md) |
| contextMenus | 请查看 [右键菜单](contextmenu.md) |
| contextMenuToggle | 是否偶数次单击右键时显示浏览器默认右键菜单 |
| plugins | 插件列表，详情请查看 [插件](plugin.md) |
| i18n | 当前播放器语言，如 `en`、`zh` |
| shortcut | 是否开启快捷键功能 |
| seekStep | 单次快进、快退的步长，快捷键中会使用到 |
| volumeStep | 单次增加、降低音量的步长，快捷键中会使用到 |
| themeColor | 主题色，请查看 [定制主题](theme.md) |
| posterBgColor | 海报背景色，请查看 [定制主题](theme.md) |
| progressBg | 进度条背景，请查看 [定制主题](theme.md) |
| progressDot | 进度条上的点，请查看 [定制主题](theme.md) |
| volumeProgressBg | 音量条背景，请查看 [定制主题](theme.md) |
| volumeBarWidth | 音量条宽度，请查看 [定制主题](theme.md) |
| loadingEl | 自定义视频 loading 元素，请查看 [定制主题](theme.md) |
| openEdgeInIE | 是否在 Win10 的 IE 中自动打开 Edge，请查看 [IE 11 兼容](ie11.md) |
| poster | 海报图片地址，请查看 [海报](poster.md) |
| posterEnable | 是否启用海报功能 |
| posterPlayEl | 自定义海报播放按钮，请查看 [定制主题](theme.md) |响应式布局](responsive.md) |

## 默认参数

```js
{
  shortcut: true,
  seekStep: 10,
  volumeStep: 0.1,
  volumeBarWidth: 100,
  settings: ['speed'],
  contextMenus: ['loop', 'pip', 'version'],
  contextMenuToggle: true,
  openEdgeInIE: true,
  posterEnable: true,
  videoProps: {
    preload: 'auto',
    playsinline: 'true',
  },
  controls: [
    ['play', 'volume', 'time', 'spacer', 'airplay', 'settings', 'web-fullscreen', 'fullscreen'],
    ['progress'],
  ],
  bpControls: {
    650: [
      ['play', 'progress', 'time', 'web-fullscreen', 'fullscreen'],
      [],
      ['spacer', 'airplay', 'settings'],
    ],
  }
}
```

:::caution

需要注意，控制条参数会根据其他参数不同而不同。如果 `isTouch` 是 `true`，则不会包括 `volume`，如果 `live` 参数是 `true`，则不会包括 `progress` 控制项。

:::

## 参数签名

```typescript
interface PlayerOptions {
  container?: HTMLElement | string;
  video?: HTMLVideoElement;
  src?: string;
  videoProps?: Record<string, any>;
  videoSources?: VideoSource[];
  live?: boolean;
  autoSeekTime?: number;
  thumbnail?: ThumbnailOptions;
  controls?: (ControlItem | string)[][];
  bpControls?: { [key: string]: (ControlItem | string)[][] }
  settings?: (SettingItem | string)[];
  contextMenus?: (ContextMenuItem | string)[];
  contextMenuToggle?: boolean;
  plugins?: Plugin[];
  i18n?: string;
  shortcut?: boolean;
  seekStep?: number;
  volumeStep?: number;
  themeColor?: string;
  posterBgColor?: string;
  progressBg?: string;
  progressDot?: HTMLElement;
  volumeProgressBg?: string;
  volumeBarWidth?: number | string;
  loadingEl?: HTMLElement;
  openEdgeInIE?: boolean;
  poster?: string;
  posterEnable?: boolean;
  posterPlayEl?: HTMLElement;
  isTouch?: boolean;
  [key: string]: any;
}

interface VideoSource {
  media?: string;
  sizes?: string;
  src?: string;
  srcset?: string;
  type?: string;
}

interface ThumbnailOptions {
  startSecond?: number;
  gapSecond?: number;
  row?: number;
  col?: number;
  width?: number;
  height?: number;
  images?: string[];
}

interface ControlItem {
  el: HTMLElement;
  id?: any;
  tip?: string;
  tooltip?: Tooltip;
  mounted?: boolean;
  init?: (player: Player, position: number, tooltip: Tooltip) => void;
  update?: (position: number) => void;
  hide?: () => void;
  isSupport?: (player: Player) => boolean;
  dispose?: () => void;
  [key: string]: any;
}

interface SettingItem<T = any> {
  id?: string;
  html?: string;
  type?: 'switch' | 'select';
  checked?: boolean;
  options?: SettingItemOption<T>[];
  value?: T;
  init?: (player: Player, item: SettingItem) => void;
  change?: (value: T, player: Player, item: SettingItem) => void;
  _switch?: Switch;
  _selectedEl?: HTMLElement;
  _optionEls?: HTMLElement[];
  _optionEl?: HTMLElement;
  [key: string]: any;
}

interface ContextMenuItem {
  id?: string;
  html?: string;
  disabled?: boolean;
  invisible?: boolean;
  checked?: boolean;
  init?: (player: Player, item: ContextMenuItem) => void;
  show?: (player: Player, item: ContextMenuItem) => void;
  click?: (player: Player, item: ContextMenuItem) => void;
}

interface Plugin {
  apply: (player: Player) => void;
  dispose?: () => void;
}
```
