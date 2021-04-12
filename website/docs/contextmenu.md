---
title: 右键菜单
---

右键菜单是在播放器上单击右键时出现的上下文菜单。

### 配置

可以通过 `contextMenus` 和 `contextMenuToggle` 来控制右键菜单。它们的默认值如下。

```js
{
  contextMenus: ['loop', 'pip', 'version'],
  contextMenuToggle: true,
}
```

`contextMenus` 默认有三个菜单项，分别是循环播放、画中画和播放器版本。可以更改它的顺序来更改 UI 的顺序，也可以移除字符串，来移除菜单项，当传入一个空数组时，单击右键将不会出现右键菜单。

`contextMenuToggle` 是用于配置是否显示原生右键菜单，为 `true` 时，将在偶数次单击时显示浏览器的右键菜单，而不是播放器右键菜单。为 `false` 时，将始终不显示浏览器右键菜单。
