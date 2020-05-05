var player = new RPlayer({
  video: {
    src: 'https://vod-progressive.akamaized.net/exp=1588691135~acl=%2A%2F623661526.mp4%2A~hmac=7755ac9f59a06a28be8e8fcde2dd93e7a6be296347bb801bb578f07880a5514c/vimeo-prod-skyfire-std-us/01/2684/7/188421287/623661526.mp4'
  },
  settings: [
    { label: '自动播放' },
    { label: '字幕', options: [{ label: '简体中文' }] },
    { label: '画质', options: [{ label: '720p' }] },
  ]
})

player.mount()
