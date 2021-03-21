window.onload = function () {
  const danmaku = new window['player-danmaku']['default']()
  const player = new window.player.Player({
    plugins: [danmaku],
    videoOptions: {
      src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    }
  })

 // { src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4' }
  player.mount('#app')
}
