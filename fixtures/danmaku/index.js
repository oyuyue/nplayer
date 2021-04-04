window.onload = function () {
  const danmaku = new window['player-danmaku']['default']()
  const player = new window.player.Player({
    plugins: [danmaku]
  })

  var hls = new Hls();
  hls.attachMedia(player.video)
  hls.loadSource('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8')

 // { src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4' }
  player.mount('#app')
}
