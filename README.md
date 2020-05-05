# RPlayer

响应式播放器 `开发中...`

![](https://i.loli.net/2020/05/05/ZCG8zrSlHXoe1fF.png)

## 兼容

目前兼容 IE11, Edge, Chrome, FireFox, Safari 等现代浏览器

## 使用

```javascript
const player = new RPlayer({
  video: {
    src: 'http://upload.wikimedia.org/wikipedia/commons/transcoded/c/c0/Big_Buck_Bunny_4K.webm/Big_Buck_Bunny_4K.webm.480p.vp9.webm'
  },
  settings: [
    { label: '自动播放' },
    { label: '字幕', options: [{ label: '简体中文' }] },
    { label: '画质', options: [{ label: '720p' }] },
  ]
})

player.mount()
// 不设置 el 参数或 mount 方法参数时，将挂载到 document.body
```

## 配置

```typescript
interface RPlayerOptions {
  media?: string | HTMLVideoElement;
  el?: string | HTMLElement;
  video?: HTMLVideoElement & { src?: string | string[] };
  settings?: (RadioOpts | SwitchOpts)[];
  preset?: OptionPreset;
}

interface OptionPreset {
  playbackRate?:
    | boolean
    | { position?: number; steps?: { label?: string; value?: number }[] };
  // 默认会显示 0.5 ~ 2.0 的播放速度在设置菜单中
}

interface RadioOpts {
  label: string;
  options: RadioOption[];
  defaultValue?: number;
  onChange?: (o: RadioOption, next: () => void) => any;
}

interface SwitchOpts {
  label: string;
  defaultValue?: false;
  onChange?: (v: boolean, next: () => void) => any;
}
```

## 待完成

- [ ] 快捷键
- [ ] 多语言
- [ ] Loading 动画
- [ ] 交互提示
- [ ] 右键菜单
- [ ] 响应式
- [ ] 移动版控件
- [ ] 广告插件
- [ ] 弹幕插件
