# NPlayer <img width="20" height="20" src="website/static/img/logo.svg" />

[![npm version](https://img.shields.io/npm/v/nplayer)](https://github.com/woopen/nplayer) 
[![gzip size](https://badge-size.herokuapp.com/woopen/nplayer/main/packages/nplayer/dist/index.min.js?compression=gzip)](https:/unpkg.com/nplayer/dist/index.min.js) 
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/08e3f1086b5748aaa745ca655ecd1c6a)](https://www.codacy.com/gh/woopen/nplayer/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=woopen/nplayer&amp;utm_campaign=Badge_Grade) 
[![Test](https://github.com/woopen/nplayer/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/woopen/nplayer/actions/workflows/test.yml) 

NPlayer 是由 Typescript 加 Sass 编写，无任何第三方运行时依赖，[兼容 IE11](https://nplayer.js.org/docs/ie11)，支持 SSR。该播放器高度可定制，提供了 [内置组件](https://nplayer.js.org/docs/api/components) 方便二次开发。并且有用插件系统，其 [弹幕功能](https://nplayer.js.org/docs/ecosystem/danmaku) 就是使用插件形式提供。该播放器可以接入任何 [流媒体](https://nplayer.js.org/docs/streaming)，如 hls、dash 和 flv 等。

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

## 文档

你可以在 [nplayer.js.org](http://nplayer.js.org) 查看 NPlayer 的文档。

查看 [快速入门章节](http://nplayer.js.org/docs/) 来快速上手 NPlayer。

## 生态

| 名称 | 版本 | 大小 |
| --- | --- | --- |
| [弹幕插件](https://nplayer.js.org/docs/ecosystem/danmaku) | [![npm version](https://img.shields.io/npm/v/nplayer)](https://github.com/woopen/nplayer) | [![gzip size](https://badge-size.herokuapp.com/woopen/nplayer/main/packages/nplayer-danmaku/dist/index.min.js?compression=gzip)](https:/unpkg.com/@nplayer/danmaku/dist/index.min.js)

## 问题 & 新功能

如果你遇到 BUG 或者是想要新功能，欢迎提交 [GitHub issues](https://github.com/woopen/nplayer/issues/new/choose)。
