---
title: 参数
---

播放器构造函数参数。

| 参数 | 描述 |
| --- | --- |
| el | 播放器挂载容器元素，同 `mount` 方法参数，如果 `mount` 没有传入参数时，将使用该参数 |

```typescript
interface PlayerOptions {
  el?: HTMLElement | string;
  video?: HTMLVideoElement;
  videoAttrs?: Record<string, any>;
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
  progressColor?: string;
  volumeProgressColor?: string;
  volumeBarWidth?: number | string;
  loadingElement?: HTMLElement;
  openEdgeInIE?: boolean;
  poster?: string;
  [key: string]: any;
}
```
