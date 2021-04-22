# NPlayer <img width="20" height="20" src="website/static/img/logo.svg" />

[![npm version](https://img.shields.io/npm/v/nplayer?logo=npm)](https://github.com/woopen/nplayer) 
[![gzip size](https://badge-size.herokuapp.com/woopen/nplayer/main/packages/nplayer/dist/index.min.js?compression=gzip)](https:/unpkg.com/nplayer/dist/index.min.js) 
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/08e3f1086b5748aaa745ca655ecd1c6a)](https://www.codacy.com/gh/woopen/nplayer/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=woopen/nplayer&amp;utm_campaign=Badge_Grade) 
[![Test](https://github.com/woopen/nplayer/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/woopen/nplayer/actions/workflows/test.yml) 

NPlayer 是由 Typescript 加 Sass 编写，无任何第三方运行时依赖，Gzip 大小只有 21KB，[兼容 IE11](https://nplayer.js.org/docs/ie11)，支持 SSR。该播放器高度可定制，所有图标、按钮、色彩等都可以替换，并且提供了 [内置组件](https://nplayer.js.org/docs/api/components) 方便二次开发。它还拥有插件系统，[弹幕功能](https://nplayer.js.org/docs/ecosystem/danmaku) 就是使用插件形式提供。该播放器可以接入任何 [流媒体](https://nplayer.js.org/docs/streaming)，如 hls、dash 和 flv 等。

![](website/static/img/preview.jpg)

## 兼容

NPlayer 兼容 IE11, Edge, Chrome, FireFox, Safari 等现代浏览器。

## 安装

```
npm i -S nplayer
```

或者使用 CDN

```html
<script src="https://unpkg.com/nplayer@latest/dist/index.min.js"></script>
```

## 快速使用

```js
import Player from "nplayer";
import Danmaku from "@nplayer/danmaku";
import items from "./items";

const danmaku = new Danmaku({
  items
});

/**
 * 官网：https://nplayer.js.org/
 * 源码：https://github.com/woopen/nplayer
 * 
 * 
 * 测试视频地址
 * https://blog.csdn.net/qq_17497931/article/details/80824328
 *
 * 部分地址
 * https://stream7.iqilu.com/10339/upload_transcode/202002/18/20200218114723HDu3hhxqIT.mp4
 * https://stream7.iqilu.com/10339/upload_transcode/202002/18/20200218093206z8V1JuPlpe.mp4
 * https://stream7.iqilu.com/10339/article/202002/18/2fca1c77730e54c7b500573c2437003f.mp4
 *
 * 还可以使用 .m3u8 .mpd 等视频格式，请引入 hls.js 等
 * 参考 https://nplayer.js.org/docs/streaming
 */

const player = new Player({
  src: "https://v-cdn.zjol.com.cn/280443.mp4",
  plugins: [danmaku]
});

player.mount(document.body);
```

![image](https://user-images.githubusercontent.com/25923128/115495970-4d925b80-a29b-11eb-9735-97c57bea23cc.png)

[![DEMO](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/ancient-sky-ujtms?file=/src/index.js)

## 文档

你可以在 [nplayer.js.org](http://nplayer.js.org) 查看 NPlayer 的文档。

查看 [快速入门章节](http://nplayer.js.org/docs/) 来快速上手 NPlayer。

## 生态

| 名称 | 版本 | 大小 |
| --- | --- | --- |
| [弹幕插件](https://nplayer.js.org/docs/ecosystem/danmaku) | [![npm](https://img.shields.io/npm/v/@nplayer/danmaku?logo=npm)](https://nplayer.js.org/docs/ecosystem/danmaku) | [![gzip size](https://badge-size.herokuapp.com/woopen/nplayer/main/packages/nplayer-danmaku/dist/index.min.js?compression=gzip)](https:/unpkg.com/@nplayer/danmaku/dist/index.min.js)

## 问题 & 新功能

如果你遇到 BUG 或者是想要新功能，欢迎提交 [issue](https://github.com/woopen/nplayer/issues/new/choose)。
