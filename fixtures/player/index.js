window.onload = function () {
  var player = new window.player.Player()
  var hls = new Hls();
  hls.attachMedia(player.video)
  hls.loadSource('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8')
 // { src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4' }
  player.mount('#app')

  var button = document.createElement('button')
  button.textContent = 'next'

  button.addEventListener('click', function() {
    hls.destroy();
    player.video.removeAttribute('src');
    hls = new Hls();
    hls.attachMedia(player.video)
    hls.loadSource('https://test-streams.mux.dev/test_001/stream.m3u8')
  })

  document.body.appendChild(button)
}
