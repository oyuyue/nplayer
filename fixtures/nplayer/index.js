window.onload = function () {

  var Quantity = {
    element: document.createElement('div'),
    init: function(player) {
      this.btn = document.createElement('div')
      this.btn.textContent = '画质'
      this.element.appendChild(this.btn);
      this.popover = new player.Player.components.Popover(this.element)
      var _this = this;
      this.btn.addEventListener('click', function () {
        _this.popover.show();
      })
      this.element.style.display = 'none';
      this.element.classList.add('quantity')
    }
  }

  var player = new NPlayer.Player({
    // videoAttrs: { src: 'http://vjs.zencdn.net/v/oceans.mp4' },
    poster: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1625100497,827999043&fm=26&gp=0.jpg',
    controls: ['play', 'volume', 'time', 'spacer', Quantity, 'airplay', 'settings', 'web-fullscreen', 'fullscreen'],
  })
  var hls = new Hls();
  hls.attachMedia(player.video)

  hls.on(Hls.Events.MEDIA_ATTACHED, function () {
    hls.loadSource('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8')
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      hls.levels.sort(function (a, b) { return b.height - a.height })
      var frag = document.createDocumentFragment();
      var listener = (i) => (init) => {
        var el = Quantity.itemElements[i] || Quantity.itemElements[Quantity.itemElements.length - 1]
        if (el) {
          Quantity.btn.textContent = el.textContent
          if (init !== true && !player.paused) setTimeout(() => player.play())
          hls.currentLevel = i;
          hls.loadLevel = i;
        }
        Quantity.popover.hide();
      }
      Quantity.itemElements = hls.levels.map((l, i) => {
        var el = document.createElement('div')
        el.textContent = l.name + 'P'
        if (l.height === 1080) el.textContent += ' 超清'
        if (l.height === 720) el.textContent += ' 高清'
        if (l.height === 480) el.textContent += ' 清晰'
        el.classList.add('quantity_item')
        el.addEventListener('click', listener(i))
        frag.appendChild(el)
        return el;
      })
      var el = document.createElement('div')
      el.textContent = '自动'
      el.addEventListener('click', listener(-1))
      el.classList.add('quantity_item')
      frag.appendChild(el)
      Quantity.itemElements.push(el)

      Quantity.popover.panelElement.appendChild(frag);
      Quantity.element.style.display = 'block';

      listener(hls.currentLevel)(true)
    });
  });


 // { src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4' }
  player.mount('#app')

  // var button = document.createElement('button')
  // button.textContent = 'next'

  // button.addEventListener('click', function() {
  //   hls.destroy();
  //   player.video.removeAttribute('src');
  //   hls = new Hls();
  //   hls.attachMedia(player.video)
  //   hls.loadSource('https://test-streams.mux.dev/test_001/stream.m3u8')
  // })

  // document.body.appendChild(button)
}
