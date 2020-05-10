var player = new RPlayer({
  video: {
    src: 'http://upload.wikimedia.org/wikipedia/commons/transcoded/c/c0/Big_Buck_Bunny_4K.webm/Big_Buck_Bunny_4K.webm.480p.vp9.webm'
  },
  settings: [
    { label: '自动播放' },
    { label: '字幕', options: [{ label: '简体中文' }] },
    { label: '画质', options: [{ label: '720p' }] },
  ],
  thumbnail: {
    images: [
      'https://i9.ytimg.com/sb/uyr0Guj8JE0/storyboard3_L2/M3.jpg?sqp=-oaymwECSEGi85f_AwYIptf96wU=&sigh=rs%24AOn4CLAJwsFNWuwCc8eMnNr08LWPlY4lWw',
    ]
  }
})

player.mount()
