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

// const ads = new RPlayerAds({
//   liner: [
//     {src: 'https://redirector.gvt1.com/videoplayback/id/a33fc5b2685eb16e/itag/15/source/gfp_video_ads/requiressl/yes/acao/yes/mime/video%2Fmp4/ctier/L/ip/0.0.0.0/ipbits/0/expire/1591551676/sparams/ip,ipbits,expire,id,itag,source,requiressl,acao,mime,ctier/signature/5354301315CA861A3DE35068F32D7F543F46E7FD.5127CF7FE2014EA5CFDAA8BAD33353F31F081A43/key/ck2/file/file.mp4', duration: 10, jumpTo: 'http://www.baidu.com'},
//     {src: 'https://interactive-examples.mdn.mozilla.net/media/examples/friday.mp4', playWait: 10, duration: 5, jumpTo: 'http://www.baidu.com'},
//   ],
//   nonLiner: [
//     {
//       imgSrc: 'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2534506313,1688529724&fm=26&gp=0.jpg',
//       total: 3,
//       jumpTo: 'http://www.baidu.com'
//     }
//   ]
// })

// player.use(ads)

player.media.style.maxHeight = '80vh'

player.mount()
