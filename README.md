# (WIP) RPlayer

[![npm version](https://img.shields.io/npm/v/rplayer.svg)](https://github.com/woopen/RPlayer)

美观、可定制的响应式播放器 `开发中...`

![](https://i.loli.net/2020/05/24/wOqB52Pr8XfioKu.png)

## 兼容

目前兼容 IE11, Edge, Chrome, FireFox, Safari 等现代浏览器

## 安装

```
npm i -S rplayer
```

或者使用 CDN

```html
<script src="https://unpkg.com/rplayer@latest/dist/index.js"></script>
```

## 使用

```javascript
import RPlayer from 'rplayer'

const player = new RPlayer({
  video: {
    src: 'http://upload.wikimedia.org/wikipedia/commons/transcoded/c/c0/Big_Buck_Bunny_4K.webm/Big_Buck_Bunny_4K.webm.480p.vp9.webm',
    crossOrigin: 'anonymous'
  },
  settings: [
    { label: '自动播放' },
    { label: '画质', options: [{ label: '720p' }] },
  ],
  subtitle: {
    captions: [{
      label: 'English',
      src: 'http://127.0.0.1:8001/friday.vtt'
    },{
      label: '中文',
      src: 'http://127.0.0.1:8001/friday-zh.vtt'
    }]
  }
})

player.mount()
// 不设置 el 参数或 mount 方法参数时，将挂载到 document.body
```

## 配置

```typescript
interface RPlayerOptions {
  media?: string | HTMLVideoElement; // 视频元素或 .video #video 等选择器字符串
  el?: string | HTMLElement; // 要挂载到的元素
  video?: HTMLVideoElement & { src?: string | string[] }; // 视频元素的属性
  settings?: (SelectOpts | SwitchOpts)[]; // 自定义设置项
  preset?: OptionPreset; // 预设
  shortcut?: ShortcutOpts; // 快捷键
  lang?: string; // 语言，默认用户当前浏览器使用的语言。
  thumbnail?: ThumbnailOpts; // 预览缩略图
  contextMenu?: ContextMenuOpts; // 右键菜单
  storage?: StorageOpts; // 持久化
  subtitle?: SubtitleOpts; // 字幕
  trays?: TrayOpts[]; // 底部控制器按钮
}

interface OptionPreset {
  playbackRate?:
    | boolean
    | { position?: number; steps?: { label?: string; value?: number }[] };
  // 默认会显示 0.5 ~ 2.0 的播放速度在设置菜单中
  version?: boolean; // 是否在右键菜单显示版本信息
}

interface SelectOpts {
  label: string;
  options: SelectOption[];
  checked?: number;
  onChange?: (o: SelectOption, update: () => void) => any;
  // 调用 update 将更新 UI
}

interface SelectOption {
  label: string;
  selectedLabel?: string;
  [key: string]: any;
}

interface SwitchOpts {
  label: string;
  checked?: false;
  onChange?: (v: boolean, next: () => void) => any;
}

interface OptionPreset {
  playbackRate?:
    | boolean
    | {
        position?: number;
        checked?: number;
        steps?: { label?: string; value?: number }[];
      };
  version?: boolean;
}

interface Shortcut {
  enable?: boolean; // 是否启用
  time?: number; // 每次递增递减的时间，默认 10s
  volume?: number; // 每次递增递减的音量，默认 0.1
  global?: boolean; // 是否捕获全局键盘事件，默认只捕获播放器的键盘事件
}

interface ThumbnailOpts {
  startTime?: number; // 缩略图的开始时间，默认 0
  gapSec?: number; // 每张缩略图的间隔时长，默认 10s
  col?: number; // 每张图片的有几列缩略图
  row?: number; // 每张图片的有几行缩略图
  width?: number; // 缩略图的宽度
  height?: number; // 缩略图的高度
  images?: string[]; // 所有的图片
  handler?: (seconds: number) => { x: number; y: number; url: string; }; // 手动控制缩略图显示，x, y 表示 background position 为正数
}

interface ContextMenuOpts {
  toggle?: boolean; // 是否和浏览器菜单交替显示
  enable?: boolean; // 是否启用右键菜单
  items?: ContextMenuItem[];
}

interface ContextMenuItem {
  icon?: string | Element; // 菜单项的 icon
  label?: string | Element; // 菜单项的值
  checked?: boolean; // 是否选中
  onClick?: (checked: boolean, update: () => void, ev: MouseEvent) => any;
  // update 用来更新 UI
}

interface StorageOpts {
  enable?: boolean; // 是否开启持久化
  key?: string; // localStorage 的 key，默认 rplayer
}

interface SubtitleOpts {
  style?: Partial<CSSStyleDeclaration>;
  checked?: number;
  captions: HTMLTrackElement[];
}

export interface TrayOpts {
  text?: string;
  icon?: string | Element;
  pos?: number;
  init?: (tray: Tray, player: RPlayer) => any;
  onClick?: (ev: MouseEvent) => any;
}
```

## 主题

主题色使用 css 变量，可以通过覆盖来自定义主题色。IE11 可以使用这个 [polyfill](https://github.com/nuxodin/ie11CustomProperties)。

```css
:root {
  --rplayer-primary: #448AFF;
  --rplayer-switch: #67cd67;
}
```

## 待完成

- [ ] 移动版控件
- [ ] 视频信息面板
- [ ] 交互日志
- [ ] 广告插件
- [ ] 弹幕插件
