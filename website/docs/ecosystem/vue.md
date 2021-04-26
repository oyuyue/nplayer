---
title: Vue2 / Vue3
---

[![npm version](https://img.shields.io/npm/v/nplayer?logo=npm)](https://github.com/woopen/nplayer) 
[![gzip size](https://badge-size.herokuapp.com/woopen/nplayer/main/packages/nplayer-vue/dist/index.min.js?compression=gzip)](https:/unpkg.com/@nplayer/vue/dist/index.min.js) 
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/08e3f1086b5748aaa745ca655ecd1c6a)](https://www.codacy.com/gh/woopen/nplayer/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=woopen/nplayer&amp;utm_campaign=Badge_Grade) 
[![Test](https://github.com/woopen/nplayer/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/woopen/nplayer/actions/workflows/test.yml) 

如果你想在 Vue2 或 Vue3 项目中使用 NPlayer，可以使用该 Vue 插件。

## 安装

```bash
npm i -S nplayer @nplayer/vue
```

你需要安装 `nplayer` 和 `@nplayer/vue`。

或者通过 CDN 的方式使用。

```html
<script src="https://unpkg.com/nplayer@latest/dist/index.min.js"></script>
<script src="https:/unpkg.com/@nplayer/vue/dist/index.min.js"></script>
```

## 快速上手

### vue2

```js
import Vue from "vue";
import NPlayer from "@nplayer/vue";
import App from "./App.vue";

Vue.use(NPlayer);
new Vue({ render: (h) => h(App) }).$mount("#app");
```

首先安装 NPlayer 插件。

```vue
<template>
  <div>
    <NPlayer
      ref="player"
      :options="{ src: 'https://v-cdn.zjol.com.cn/280443.mp4' }"
      :set="setPlayer"
    />
  </div>
</template>
<script>
export default {
  methods: {
    setPlayer(player) {
      this.$options.player = player;
    },
  },
  mounted() {
    console.log(this.$refs.player.player === this.$options.player);
  },
};
</script>
```

### vue3

```js
import { createApp } from "vue";
import NPlayer from "@nplayer/vue";
import App from "./App.vue";

createApp(App).use(NPlayer).mount("#app");
```

首先安装 NPlayer 插件。

```vue
<template>
  <div>
    <NPlayer
      :options="{ src: 'https://v-cdn.zjol.com.cn/280443.mp4' }"
      :set="setPlayer"
    />
  </div>
</template>
<script>
import { onMounted } from "vue";
export default {
  setup() {
    let player = null;

    onMounted(() => {
      console.log(player);
    });

    return {
      setPlayer: (p) => (player = p),
    };
  },
};
</script>
```

首先我们使用 `use` 方法应用插件，它可以接收一个参数，是组件的名称。

```js
Vue.use(NPlayer, { name: 'NPlayer' })
```

默认组件名是 `NPlayer`。

NPlayer 组件接收一个 `options` prop。它是 NPlayer 构造函数参数，详情请查看 [配置](api/config.md)。

NPlayer 内部把播放器包裹在一个 `width` 和 `height` 都是 `100%` 的 div 中，你可以通过 `class` 和 `style` prop，设置它的 css 类名和样式。

你还可以通过 `set` prop，来获取播放器实例，它是一个函数第一个参数就是播放器实例。`(player: Player) => void`

## 在线预览 & 编辑

Vue2 DEMO: [https://codesandbox.io/s/nplayer-vue2-demo-9lps9?file=/src/main.js](https://codesandbox.io/s/nplayer-vue2-demo-9lps9?file=/src/main.js)

Vue3 DEMO: [https://codesandbox.io/s/nplayer-vue3-demo-mt8s4?file=/src/main.js](https://codesandbox.io/s/nplayer-vue3-demo-mt8s4?file=/src/main.js)
