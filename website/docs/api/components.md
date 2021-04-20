---
title: 内置组件
---

NPlayer 提供了一些内置组件，可以方便二次开发和统一交互。

你可以在 Player 类的 `components` 属性上访问到这些组件，或者直接导入。

```js
import Player, { Tooltip } from 'nplayer'

console.log(Tooltip === Player.components.Tooltip) // true
```

这些组件都有如下相同点。

- 构造函数第一个参数是该组件的容器元素。
- 都有 `element` 属性，表示自己 DOM。
- 都有 `dispose` 方法，调用该方法将销毁组件。

## Tooltip 文字提示

控制条项的提示了该组件。

### API

#### constructor(container: HTMLElement, html?: string)

第一个是容器元素，第二个是可选的 `html` 提示文字。

#### html

获取和设置 `innerHtml`

#### show(): void

显示 Tooltip。

#### hide(): void

隐藏 Tooltip。

#### setLeft(): void

与容器左对齐。

#### setRight(): void

与容器右对齐。

### 例子

```js
const tooltip = new Tooltip(document.body, '提示~')
tooltip.html = '修改提示'
tooltip.show() // 显示
tooltip.hide() // 隐藏
console.log(tooltip.element)
tooltip.dispose() // 销毁
```

## Switch 开关

switch 类型的设置菜单项使用了该组件。

### API

#### constructor(container: HTMLElement, value?: boolean, change?: (v: boolean) => void)

第二个参数表示当前是否是选中状态，第三个参数是 `value` 改变时的回调。

#### toggle(value?: boolean): void

切换当前开关的值，如果传入 `value` 则表示强制设置成传入值的状态。

### 例子

```js
const switch = new Switch(document.body, false, (v) => {
  if (v) console.log('开启了')
})
```

## Popover 弹出框

控制条条上的设置弹框和弹幕设置的弹框，都使用了该组件。

### API

#### constructor(container: HTMLElement, onHide?: (ev?: MouseEvent) => void, style?: Partial\<CSSStyleDeclaration\>, left?: boolean)
  
- `onHide` 当弹出框隐藏时会调用。
- `style` 弹出框的样式。
- `left` 是否和容器左对齐，默认是右对齐。

#### panelElement: HTMLElement

弹出框元素。

#### maskElement: HTMLElement

遮罩元素。

#### applyPanelStyle(style: Partial\<CSSStyleDeclaration\>): void
  
设置弹出框的样式。

#### show()

显示弹出框。

#### hide()

隐藏弹出框，你无需手动调用该函数，当用户点击弹出框外面时，会自动隐藏。

### 例子

```js
const popover = new Popover(player.element)
const div = document.createElement('div')
div.textContent = '开/关'
popover.panelElement.appendChild(div)
new Switch(popover.panelElement)
```

## Slider 滑块

弹幕插件的弹幕设置使用了该组件，它的值的范围是 0 到 1。

### API

#### constructor(container: HTMLElement, opts: SliderOption, player?: Player)

```typescript
interface SliderOption {
  value?: number;
  stops?: { value: number, html?: string }[];
  change?: (value: number) => void;
  step?: boolean;
}
```

- opts.value 当前的值。
- opts.stops 滑块上的断点。
- opts.change 当用户修改滑块值是会调用。
- opts.step 滑动滑块时，是否自动吸附到最近的断点上。

第三个参数是 player 播放器对象，如果传入该参数，当播放器尺寸变化是会自动更新滑块尺寸和位置，否则需要自己调用 `slider.rect.update()`。

#### rect: Rect

可以通过它获取滑块的 `width, height, x, y`，调用 `update` 方法，将更新滑块尺寸。

#### update(value: number, x?: number, trigger = true): void

手动更新滑块的值，第二个参数是滑块 x 的值，没有可以不传，内部会自动计算。第三个参数是是否触发 `change` 回调。

### 例子

```js
new Slider(div, {
  stops: [{ value: 0, html: '10%' }, { value: 1, html: '100%' }],
  change(value) {
    danmaku.updateOpacity(clamp(value + 0.1, 0.1, 1));
  },
}, player)
// 不透明度
```

## Checkbox 复选框

弹幕插件的弹幕设置使用了该组件。

### API

#### constructor(container: HTMLElement, opts: CheckboxOptions)

```typescript
interface CheckboxOptions {
  html?: string;
  checked?: boolean;
  change?: (newValue: boolean) => void;
}
```

- opts.html 复选框描述。
- opts.checked 当前是否选中。
- change 当值变动时的回调。

#### update(v: boolean)

更新当前是否勾选。

### 例子

```js
new Checkbox(div, {
  html: '从下到上', change(v) { danmaku.updateBottomUp(v); },
})
```
