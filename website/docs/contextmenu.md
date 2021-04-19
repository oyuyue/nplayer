---
title: 右键菜单
---

右键菜单是在播放器上单击右键时出现的上下文菜单。

## 配置

可以通过 `contextMenus` 和 `contextMenuToggle` 来控制右键菜单，它们的默认值如下。

```js
{
  contextMenus: ['loop', 'pip', 'version'],
  contextMenuToggle: true,
}
```

`contextMenus` 默认有三个菜单项，分别是循环播放、画中画和播放器版本。可以更改它的顺序来更改 UI 的顺序，也可以移除字符串，来移除菜单项，当传入一个空数组时，单击右键将不会出现右键菜单。

`contextMenuToggle` 是用于配置是否显示原生右键菜单，为 `true` 时，将在偶数次单击时显示浏览器的右键菜单，而不是播放器右键菜单。为 `false` 时，将始终不显示浏览器右键菜单。

## 自定义菜单项

菜单项对象签名如下：

```typescript
interface ContextMenuItem {
  id?: string; // 菜单项 id 一般只在菜单项中才会使用
  html?: string; // 菜单文字，可以使用 html 字符串
  disabled?: boolean; // 是否禁用
  invisible?: boolean; // 是否可见
  checked?: boolean; // 是否是选中状态
  init?: (player: Player, item: ContextMenuItem) => void; // 初始化时会调用一次
  show?: (player: Player, item: ContextMenuItem) => void; // 每次右键菜单展示时会调用
  click?: (player: Player, item: ContextMenuItem) => void; // 用户单击该项会调用
}
```

:::caution 

`html` 属性，会直接使用 `innerHTML` 设置到 DOM，不会经过安全处理。需要自己保障它不会包含恶意代码。 

:::

我们可以自己实现一个画中画菜单项。

```js
const MyPIP = {
  html: '我的画中画',
  init() {
    this.invisible = !('pictureInPictureEnabled' in document);
    // 初始化是判断浏览器是否不支持，不支持则隐藏自己
  },
  click(player) {
    if (player.video.readyState < 3) return; // 视频还没加载成功
    if ((document as any).pictureInPictureElement !== player.video) {
      (player.video as any).requestPictureInPicture();
    } else {
      (document as any).exitPictureInPicture();
    }
  },
}

new Player({
  contextMenus: ['loop', 'pip', MyPIP, 'version'],
})
```

我们新建了一个自己的画中画项目，然后把它加入到自带画中画按钮下方。

## 获取和注册菜单项

`player` 提供了两个方法来注册和获取菜单项对象。

### registerContextMenuItem(item: ContextMenuItem, id?: string)

你可以使用该方法注册菜单项目，一般只会在自定义插件中会使用。详情请查看 [插件章节](plugin.md)。

### getContextMenuItem(id: string): ContextMenuItem | null

你可以用该方法获取指定 id 的菜单项。

```js
const player = new Player()
const pip = player.getContextMenuItem('pip')

if (pip) {
  pip.disabled = true
  pip.html = '我的PIP'
}
```

对于 `contenxtmenu` 的配置项，你可以随便修改它的字段，在下一次展示右键菜单时，会使用最新的值。

## 例子

点击下面链接查看对应右键菜单例子。

- [视频截图](screenshot.md)
