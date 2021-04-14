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
  html?: string;
  selectedHtml?: string;
  value?: T;
}

interface SettingItem<T = any> {
  id?: string;
  html?: string;
  type?: 'switch' | 'select';
  checked?: boolean;
  options?: SettingItemOption<T>[];
  value?: T;
  init?: (player: Player, item: SettingItem) => void;
  change?: (value: T, player: Player, item: SettingItem) => void;
}
```

其中 `id` 参数是 `SettingItem` 的 `id`，就像上面提到的 `speed`。如果传入的是一个字符串时，就会通过这个字符串找到 `id` 与之对应的 `SettingItem` 。

当然在自己使用时无需设置 `id` 参数，`id` 参数是在编写第三方插件时才会使用，详情请查看 [插件章节](plugin.md)。

`html` 就是在菜单项显示的 label 提示，如， `speed` 中的 `html` 是"播放速度"。

设置菜单项分为两种类型，`switch` 和 `select`，不同类型的菜单项，它们的必填参数并不一样。

## switch 类型

## select 类型
