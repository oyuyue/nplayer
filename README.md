# NPlayer <img width="20" height="20" src="website/static/img/logo.svg" />

[![npm version](https://img.shields.io/npm/v/nplayer?logo=npm)](https://github.com/woopen/nplayer) 
[![gzip size](https://badge-size.herokuapp.com/woopen/nplayer/main/packages/nplayer/dist/index.min.js?compression=gzip)](https:/unpkg.com/nplayer/dist/index.min.js) 
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/08e3f1086b5748aaa745ca655ecd1c6a)](https://www.codacy.com/gh/woopen/nplayer/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=woopen/nplayer&amp;utm_campaign=Badge_Grade) 
[![Test](https://github.com/woopen/nplayer/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/woopen/nplayer/actions/workflows/test.yml) 
[![Discord](https://img.shields.io/discord/844458401878638593?logo=discord)](https://discord.gg/kTDVGhV3tP) 

NPlayer 是由 Typescript 加 Sass 编写，无任何第三方运行时依赖，兼容 IE11，支持移动端、支持 SSR、支持直播。高度可定制，所有图标、主题色等都可以替换，并且提供了内置组件方便二次开发。你可以自定义任意多个断点，不仅仅是兼容移动端，只要愿意，你可以非常轻松的兼容手机竖屏、手机横屏、平板等设备。它还拥有插件系统，弹幕功能就是使用插件形式提供，使用时按需引入即可。该播放器还可以接入任何流媒体，如 hls、dash 和 flv 等。欢迎 Star~

![](website/static/img/preview.jpg)

https://user-images.githubusercontent.com/25923128/118526973-5def0680-b773-11eb-9aa4-364dca7d5eaa.mov

## 安装

```bash
npm i -S nplayer
```

或者使用 CDN

```html
<script src="https://unpkg.com/nplayer@latest/dist/index.min.js"></script>
```

## 快速使用

```js
import Player from "nplayer";

/**
 * Danmaku DEMO:
 *    https://codesandbox.io/s/nplayer-demo-ujtms?file=/src/index.js
 * React DEMO:
 *    https://codesandbox.io/s/nplayer-react-demo-p558g?file=/src/App.js
 * Vue2 DEMO:
 *    https://codesandbox.io/s/nplayer-vue2-demo-9lps9?file=/src/main.js
 * Vue3 DEMO:
 *    https://codesandbox.io/s/nplayer-vue3-demo-mt8s4?file=/src/main.js
 */
const player = new Player({
  src: "https://v-cdn.zjol.com.cn/280443.mp4"
});

player.mount(document.body);
```

[![image](https://user-images.githubusercontent.com/25923128/115495970-4d925b80-a29b-11eb-9735-97c57bea23cc.png)](https://codesandbox.io/s/ancient-sky-ujtms?file=/src/index.js)

[![DEMO](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/ancient-sky-ujtms?file=/src/index.js)

## 文档

你可以在 [nplayer.js.org](http://nplayer.js.org) 查看 NPlayer 的文档。

查看 [快速入门章节](http://nplayer.js.org/docs/) 来快速上手 NPlayer。

## 生态

| 名称 | 版本 | 大小 |
| --- | --- | --- |
| [弹幕插件](https://nplayer.js.org/docs/ecosystem/danmaku) | [![npm](https://img.shields.io/npm/v/@nplayer/danmaku?logo=npm)](https://nplayer.js.org/docs/ecosystem/danmaku) | [![gzip size](https://badge-size.herokuapp.com/woopen/nplayer/main/packages/nplayer-danmaku/dist/index.min.js?compression=gzip)](https:/unpkg.com/@nplayer/danmaku/dist/index.min.js)
| [React](https://nplayer.js.org/docs/ecosystem/react) | [![npm](https://img.shields.io/npm/v/@nplayer/react?logo=npm)](https://nplayer.js.org/docs/ecosystem/react) | [![gzip size](https://badge-size.herokuapp.com/woopen/nplayer/main/packages/nplayer-react/dist/index.min.js?compression=gzip)](https:/unpkg.com/@nplayer/react/dist/index.min.js)
| [Vue2 / Vue3](https://nplayer.js.org/docs/ecosystem/vue) | [![npm](https://img.shields.io/npm/v/@nplayer/vue?logo=npm)](https://nplayer.js.org/docs/ecosystem/vue) | [![gzip size](https://badge-size.herokuapp.com/woopen/nplayer/main/packages/nplayer-vue/dist/index.min.js?compression=gzip)](https:/unpkg.com/@nplayer/vue/dist/index.min.js)

## 例子

- [视频清晰度切换](https://nplayer.js.org/docs/examples/quantity-switch)
- [视频截图](https://nplayer.js.org/docs/examples/screenshot)
- [视频镜像](https://nplayer.js.org/docs/examples/mirroring)
- [迷你播放器](https://nplayer.js.org/docs/examples/mini)
- [自定义 Bilibili 主题](https://nplayer.js.org/docs/examples/bilibili-theme)

## 问题 & 新功能

如果你遇到 BUG 或者是想要新功能，欢迎提交 [issue](https://github.com/woopen/nplayer/issues/new/choose)。

## 贡献

如果想参与贡献，请查看 [CONTRIBUTING](https://github.com/woopen/nplayer/blob/main/CONTRIBUTING.md) 。
