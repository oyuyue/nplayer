---
title: 内置组件
---

NPlayer 提供了一些内置组件，可以方便二次开发和统一交互。

你可以在 Player 类的 `components` 属性上访问到这些组件，或者直接导入。

```js
import Player, { Tooltip } from 'nplayer'

console.log(Tooltip === Player.components.Tooltip) // true
```

这些组件构造函数的第一个参数都相同，是该组件的容器元素。

## Tooltip 文字提示

控制条项的提示了该组件。

### API

### 例子

## Switch 开关

switch 类型的设置菜单项使用了该组件。

### API

### 例子

## Popover 弹出框

控制条条上的设置弹框和弹幕设置的弹框，都使用了该组件。

### API

### 例子

## Slider 滑块

弹幕插件的弹幕设置使用了该组件。

### API

### 例子

## Checkbox

弹幕插件的弹幕设置使用了该组件。

### API

### 例子
