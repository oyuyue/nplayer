---
title: 设置菜单
---

设置菜单是控制条中的设置组件，也就是 [控制条章节](control.md) 中的 `settings` 项。

你可以通过 `settings` 参数自由的添加和移除设置项。`settings` 的默认参数是 `['speed']`，也就是默认只有一个调节视频播放速度的设置项目。

`settings` 数组中，除了字符串还可以是 `SettingItem` 对象，它可以实现自定义设置项。

## SettingItem

它的接口定义如下。

```typescript
interface SettingItemOption<T = any> {
  html?: string; // 显示的 label 
  selectedHtml?: string; // 被选中时显示的 label，不填写会使用 html
  value?: T; // 该项的值
}

interface SettingItem<T = any> {
  id?: string; // 设置项 id
  html?: string; // 菜单项显示的 label 提示
  type?: 'switch' | 'select'; // 类型
  checked?: boolean; // 是否是选中状态
  options?: SettingItemOption<T>[]; // 选项
  value?: T; // 当前选中的值，与 options 中的 value 对应
  init?: (player: Player, item: SettingItem) => void; // 初始化时，会调用
  change?: (value: T, player: Player, item: SettingItem) => void; // 当用户修改时会调用
  [key: string]: any;
}
```

其中 `id` 参数是 `SettingItem` 的 `id`，就像上面提到的 `speed`。如果传入的是一个字符串时，就会通过这个字符串找到 `id` 与之对应的 `SettingItem` 。

一般 `id` 参数是在编写第三方插件时才会使用，详情请查看 [插件章节](plugin.md)。

`html` 就是在菜单项显示的 label 提示，如， `speed` 中的 `html` 是"播放速度"。

设置菜单项分为两种类型，`switch` 和 `select`，不同类型的菜单项，它们的必填参数并不一样。

## switch

和 `switch` 相关的设置项是 `checked`。当用户点击修改该项目的值时会调用 `change` 函数，第一个参数就是新 `checked` 的值，你无需在 `change` 中自己修改 `checked` 的值，在调用 `change` 之前，内部就将 `checked` 更新完成了。

## select

`options` 和 `value` 与该类型相关。`value` 是当前选中的值，`options` 是选项。

```js
const speedSettingItem = {
  html: '播放速度',
  type: 'select',
  value: 1,
  options: [
    { value: 0.25, html: '0.25' },
    { value: 0.5, html: '0.5' },
    { value: 1, html: '正常' },
    { value: 1.5, html: '1.5' },
    { value: 2, html: '2' },
  ],
  init(player) {
    player.playbackRate = 1;
  },
  change(value, player) {
    this.value = player.playbackRate = value;
  },
}
```

上面是内置播放速度设置项目的相关配置。

## 注册和获取设置项

- `registerSettingItem(item: SettingItem, id?: string): void` 用来注册设置项，一般只在插件中使用，详情请查看 [插件章节](plugin.md)。

- `getSettingItem(id: string): SettingItem | null` 可以获取相关设置项。

```js
const player = new Player()
const speed = player.getSettingItem('speed')
console.log(speed)
```

上面代码获取并打印内置 `speed` 项，你无法修改，如 `html` 项目来修改对应 label。因为设置只会在初始化中初始化一次，就会被缓存起来。如果你查看上面的打印结构你会发现一些额外的字段。

```js
interface SettingItem<T = any> {
  // ...
  _switch?: Switch;
  _selectedElement?: HTMLElement;
  _optionElements?: HTMLElement[];
  _optionElement?: HTMLElement;
}
```

内部会使用上面这 4 字段缓存，`switch` 和 `select` 类型的 DOM 元素。从而避免每次创建对应 DOM 元素。所以自定义字段不要与这些字段重名。
