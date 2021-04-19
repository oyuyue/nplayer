---
title: 安装
---

可以通过 npm 或 yarn 使用如下命令来安装 NPlayer。

```bash
npm i -S nplayer
```

或

```bash
yarn add nplayer
```

然后只需要在代码中引入 NPlayer 就行了。

```js
import Player from 'nplayer'

const player = new Player()
player.mount('#app')
```

无需导入 NPlayer 的样式文件，NPlayer 的样式文件包含在 NPlayer 的 js 文件中，在运行时会自动将样式插入 `head` 中。

### CDN 

除了使用 npm 包的形式，还可以通过 CDN 来安装，只需要要一个链接就可以将 NPlayer 引入。

```js
<script src="https://unpkg.com/nplayer@latest/dist/index.min.js"></script>
```

或者可以选择使用 [jsDELIVR CDN](https://www.jsdelivr.com/package/npm/nplayer)。

```js
<script src="https://cdn.jsdelivr.net/npm/nplayer@latest/dist/index.min.js"></script>
```

同样，使用 CDN 的方式，也无需引入 NPlayer 的样式文件。

:::info

NPlayer 使用的 umd 格式，所以在没使用 amd 或 commonjs 时，可以通过 `window.NPlayer` 访问到。

:::


在引入 CDN 链接后就可以使用了。

```js
const player = new NPlayer.Player()
player.mount('#app')
```

:::caution 注意

在通过 CDN 的方式使用时，Player 类是在 NPlayer 对象的 `Player` 属性上。需要 `new NPlayer.Player()` 而不是 `new NPlayer()`。

:::
