# RPlayerAds

[![npm version](https://img.shields.io/npm/v/rplayer.svg)](https://github.com/woopen/RPlayer)

[RPlayer](https://github.com/woopen/RPlayer) 广告插件

![](https://i.loli.net/2020/07/12/WaoLXDKP1I85Mgn.png)

## 安装

```
npm i -S @rplayer/ads
```

或者使用 CDN

```html
<script src="https://unpkg.com/@rplayer/ads@latest"></script>
```

## 使用

```javascript
import RPlayer from 'rplayer'
import RPlayerAds from '@rplayer/ads'

const player = new RPlayer({
  video: {
    src: 'http://upload.wikimedia.org/wikipedia/commons/transcoded/c/c0/Big_Buck_Bunny_4K.webm/Big_Buck_Bunny_4K.webm.480p.vp9.webm',
    crossOrigin: 'anonymous'
  },
  settings: [
    { label: '自动播放' },
    { label: '画质', options: [{ label: '720p' }] },
  ],
  subtitle: {
    captions: [{
      label: 'English',
      src: 'http://127.0.0.1:8001/friday.vtt'
    },{
      label: '中文',
      src: 'http://127.0.0.1:8001/friday-zh.vtt'
    }]
  }
})

const ads = new RPlayerAds({
  liner: [
    {src: 'https://interactive-examples.mdn.mozilla.net/media/examples/friday.mp4', duration: 5},
    {src: 'https://interactive-examples.mdn.mozilla.net/media/examples/friday.mp4', playWait: 10, duration: 5},
  ],
  nonLiner: [
    {
      imgSrc: 'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2534506313,1688529724&fm=26&gp=0.jpg',
      total: 3,
    }
  ]
})

player.use(ads)

player.mount()
```

## 配置

```typescript
interface AdsOpts {
  liner?: LinerAdsItem[]; // 视频广告
  nonLiner?: NonLinerAdsItem[]; // 弹框广告
  onError?: (
    item: LinerAdsItem | NonLinerAdsItem,
    timeLeft?: number // 广告的剩余时间
  ) => boolean | void; // 出错时调用，返回 true 将跳过这个视频
  linerTimeout?: (items: LinerAdsItem[]) => boolean | void; // 参数是剩余的视频，广告剩余时间为 0 时，但是广告并没有播放完毕，返回 true 将播放正片
  enhanceVideo?: (video: HTMLVideoElement) => any; // 对广告 video 元素进行设置
  adBadge?: boolean; // 是否显示 广告 标识
}

interface AdsItem<T> {
  jumpTo?: string; // 点击广告时，跳转的链接
  onClick: (item: T) => any; // 当点击广告时
  [key: string]: any;
}

interface LinerAdsItem extends AdsItem<LinerAdsItem> {
  src: string;
  playAt?: number; // 在哪个时间点播放
  playWait?: number; // 正片播放多久 播放该广告 
  duration?: number; // 广告的时长
}

interface NonLinerAdsItem extends AdsItem<NonLinerAdsItem> {
  imgSrc?: string; // 图片的 src
  content?: string | Element; // 或者自定义广告元素
  showed?: number; // 显示了几次
  total?: number; // 一共显示几次
}
```
