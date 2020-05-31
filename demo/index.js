// var video = document.createElement('video');
// var videoSrc = 'http://192.168.1.7:8001/master.m3u8';
// var hls = new Hls();
// hls.loadSource(videoSrc);
// hls.attachMedia(video);

var player = new RPlayer({
  // media: video,
  video: {
    // src: 'http://upload.wikimedia.org/wikipedia/commons/transcoded/c/c0/Big_Buck_Bunny_4K.webm/Big_Buck_Bunny_4K.webm.480p.vp9.webm',
    src: 'http://127.0.0.1:8001/video.mp4',
    crossOrigin: 'anonymous'
  },
  settings: [
    { label: '自动播放' },
    { label: '画质', options: [{ label: '720p' }] },
  ],
  thumbnail: {
    images: [
      'https://i9.ytimg.com/sb/uyr0Guj8JE0/storyboard3_L2/M3.jpg?sqp=-oaymwECSEGi85f_AwYIptf96wU=&sigh=rs%24AOn4CLAJwsFNWuwCc8eMnNr08LWPlY4lWw',
    ]
    // images: [
    //   'http://192.168.1.7:8001/M1.jpg',
    //   'http://192.168.1.7:8001/M2.jpg',
    //   'http://192.168.1.7:8001/M3.jpg',
    // ]
  },
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

// player.on(RPlayer.Events.ERROR, function() {
//   hls.swapAudioCodec();
//   hls.recoverMediaError();
// })

const ads = new RPlayerAds({
  liner: [
    {src: 'https://interactive-examples.mdn.mozilla.net/media/examples/flower.webm', duration: 5},
    {src: 'https://media.w3.org/2010/05/sintel/trailer.mp4', duration: 5 },
    {src: 'http://www.w3school.com.cn/example/html5/mov_bbb.mp4', duration: 5 },
  ]
})

player.use(ads)

player.media.style.maxHeight = '80vh'

player.mount()
