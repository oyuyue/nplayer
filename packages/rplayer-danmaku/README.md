# (WIP) RPlayerDanmaku

[![npm version](https://img.shields.io/npm/v/rplayer.svg)](https://github.com/woopen/RPlayer)

[RPlayer](https://github.com/woopen/RPlayer#wip-rplayer) 弹幕插件

![](https://i.loli.net/2020/07/12/UZx6r7puE3RFVMD.png)


## 安装

```
npm i -S @rplayer/danmaku
```

或者使用 CDN

```html
<script src="https://unpkg.com/@rplayer/danmaku@latest"></script>
```

## 使用

```javascript
import RPlayer from 'rplayer'
import RPlayerDanmaku from '@rplayer/danmaku'

const danmaku = new RPlayerDanmaku({
  items: [
    { text: 'danmaku', time: 1, color: '#2196F3' },
    { text: '弹幕', time: 2, color: '#E91E63' },
    { text: 'example', time: 3 },
  ],
});

player.use(danmaku)
player.mount()
```

## 配置

```typescript
interface DanmakuOptions {
  items?: Item[]; // 弹幕
  on?: boolean; // 是否开启
  blockTypes?: ('scroll' | 'top' | 'bottom' | 'color')[]; // 禁用类型
  opacity?: number; // 透明度
  area?: number; // 显示区域 0 - 1
  speed?: number; // 速度倍速
  fontSize?: number; // 字体大小倍速
  unlimited?: boolean; // 无限弹幕
  bottomUp?: boolean; // 从下到上
  merge?: boolean; // 合并重复弹幕
  baseFontSize?: number; // 字体大小，默认 24
  colors?: string[]; // 发送弹幕可选择颜色
  type?: number; // 默认发送弹幕类型，[滚动, 顶部, 底部]
  color?: number; // 发送弹幕颜色
  sendPlaceholder?: string; // 发送弹幕 placeholder
  sendHide?: boolean; // 是否隐藏发送区域
  maxLen?: number; // 发送弹幕最长长度 默认 50
}

interface Item {
  text: string;
  time: number;
  color?: string;
  fontFamily?: string;
  type?: 'top' | 'bottom' | 'scroll';
  isMe?: boolean;
}
```
