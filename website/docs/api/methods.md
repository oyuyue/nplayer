---
title: 方法
---

NPlayer 实例方法如下。

### mount(el?: HTMLElement | string): void

### incVolume(v = this.opts.volumeStep): void

### decVolume(v = this.opts.volumeStep): void

### toggleVolume(): void

### forward(v = this.opts.seekStep): void

### rewind(v = this.opts.seekStep): void

### play(): Promise<void> 

### pause(): void

### toggle(): void

### seek(seconds: number): void

### registerSettingItem(item: SettingItem, id?: string): void

### registerContextMenuItem(item: ContextMenuItem, id?: string): void

### registerControlItem(item: ControlItem, id?: string): void

### getSettingItem(id: string): SettingItem | null

### getContextMenuItem(id: string): ContextMenuItem | null

### getControlItem(id: string): ControlItem | null

### updateOptions(opts: PlayerOptions): void

### disableClickPause(): void

### enableClickPause(): void

### dispose(): void
