---
title: React
---

[![npm version](https://img.shields.io/npm/v/nplayer?logo=npm)](https://github.com/woopen/nplayer) 
[![gzip size](https://badge-size.herokuapp.com/woopen/nplayer/main/packages/nplayer-react/dist/index.min.js?compression=gzip)](https:/unpkg.com/@nplayer/react/dist/index.min.js) 
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/08e3f1086b5748aaa745ca655ecd1c6a)](https://www.codacy.com/gh/woopen/nplayer/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=woopen/nplayer&amp;utm_campaign=Badge_Grade) 
[![Test](https://github.com/woopen/nplayer/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/woopen/nplayer/actions/workflows/test.yml) 

如果你想在 React 项目中使用 NPlayer，可以使用 React 组件。

## 安装

```bash
npm i -S nplayer @nplayer/react
```

你需要安装 `nplayer` 和 `@nplayer/react`。

或者通过 CDN 的方式使用。

```html
<script src="https://unpkg.com/nplayer@latest/dist/index.min.js"></script>
<script src="https:/unpkg.com/@nplayer/react/dist/index.min.js"></script>
```

## 快速上手

```jsx
import { useEffect, useRef } from "react";
import NPlayer from "@nplayer/react";
import Hls from 'hls.js';

export default function App() {
  const player = useRef();
  const url = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

  useEffect(() => {
    console.log(player.current);
  }, []);

  const handleStreamLoad = (playerInstance) => {
    const hls = new Hls();
    hls.attachMedia(playerInstance.video);
    hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      hls.loadSource(url);
    });
  }

  return (
    <div>
      <NPlayer
        ref={player}
        className=" "
        style={{  }}
        options={{ src: url }}
        onStreamLoad={handleStreamLoad}
      />
    </div>
  );
}
```

NPlayer 组件接收一个 `options` prop。它是 NPlayer 构造函数参数，详情请查看 [配置](api/config.md)。

NPlayer 组件接受一个 `onStreamLoad` prop。方便处理流媒体协议的接入。

NPlayer 内部把播放器包裹在一个 `width` 和 `height` 都是 `100%` 的 div 中，你可以通过 `className` 和 `style` prop，设置它的 css 类名和样式。

## 在线预览

React DEMO: [https://codesandbox.io/s/nplayer-react-demo-p558g](https://codesandbox.io/s/nplayer-react-demo-p558g)
