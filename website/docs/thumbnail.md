---
title: 预览缩略图
---

当鼠标放到进度条上时就会出现，一个小缩略图来预览这个时间点的截图，现在很多视频网站都有这个功能。NPlayer 也提供了这个功能。

NPlayer 的缩略图有 `thumbnail` 参数设置，它是一个缩略图配置对象，具体接口如下：

```typescript
interface ThumbnailOptions {
  startSecond?: number;
  gapSecond?: number;
  row?: number;
  col?: number;
  width?: number;
  height?: number;
  images?: string[];
}
```

它个各个属性默认值如下：

```js
{
  startSecond: 0,
  gapSecond: 10,
  col: 5,
  row: 5,
  width: 160,
  height: 90,
  images: []
}
```

这个预览缩略图其实是由一堆分辨率较小的截图组成的一张图片，如下所示。

![Docusaurus](/img/M1.jpg)

我们可以看到这个雪碧图由 `5 x 5` 的小缩略图组成，当然一个视频可能有一堆上面这种雪碧图，这就是上面 `images` 是一个数组字符串的原因。

了解了雪碧图，下面来详细了解各个参数分别是什么意思吧。

| 参数 | 描述 |
| --- | --- |
| startSecond | 缩略图制作的开始时间，比如缩略图是视频的第一秒开始制作的那么，这里就是 1 |
| gapSecond | 一张小缩略图时间跨度，如果小缩略图是每 5 秒截一张，那么这里就填 5 |
| col | 雪碧图的列数 |
| row | 雪碧图的行数 |
| width | 小缩略图的宽 |
| height | 小缩略图的高 |
| images | 雪碧图的链接地址数组 |

## 缩略图制作

有很多方式可以制作视频的预览缩略图，比如用 NodeJS `node-fluent-ffmpeg` 库中的 [thumbnails](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg#screenshotsoptions-dirname-generate-thumbnails) 方法。当然大家可以去网上寻找更多方法。

这里介绍如何直接用 ffmpeg 命令行生成视频缩略图。

:::info

ffmpeg 是非常强大音视频工具，很多播放器都是它作为内核，更多详情请查看 [官方文档](https://www.ffmpeg.org/)。

:::

首先需要去 [ffmpeg 官网](https://www.ffmpeg.org/)下载并安装好 ffmpeg 。

安装好后可以在命令行执行下面命令。

```bash
ffmpeg -i ./test.webm -vf 'fps=1/10:round=zero:start_time=-9,scale=160x90,tile=5x5' M%d.jpg
```

通过上面这个命令生成一堆 `5 x 5` 的雪碧图，每个雪碧图中小缩略图的尺寸是 `160 x 90`。雪碧图的文件名是 M1.jpg、M2.jp、M3.jpg... 这样递增。

`-i` 参数后面是视频文件。

`-vf` 参数后面跟着过滤器，多个过滤器用 `,` 分开，一个过滤器多个参数使用 `:` 分开。

`fps=1/10` 表示每 10 秒输出一张图片，`round=zero` 为时间戳向 `0` 取整。`start_time=-9` 是让它从第 `1` 秒开始截取，忽略掉 `0` 秒的黑屏帧，这里是 `-9`，而不是 `1` 的原因是，`fps` 我们设置的是 `10` 秒一张，所以想要从第 `1` 秒开始时，就用 `1 - 10` 等于 `-9`。

`scale=160x90` 设置输出图像分辨率大小，`tile=5x5` 将小图用 `5x5` 的方式组合在一起。

最后面的 `M%d.jpg` 就是文件名，`%d` 表示按数字递增。

那么用上面命令生成的缩略图，可以设置如下参数。

```js
new Player({
  thumbnail: {
    startSecond: 1,
    images: ['M1.jpg', 'M2.jpg', 'M3.jpg']
  }
})
```

由于其他参数都可以使用默认值，所以这里就不填了。

## 推荐文章

- [流媒体视频基础 MSE 入门 & FFmpeg 制作视频预览缩略图和 fmp4](https://juejin.cn/post/6953777965838630926)
