window.onload = function () {
  const e = React.createElement;
  const url = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

  const handleStreamLoad = (playerInstance) => {
    const hls = new Hls();
    hls.attachMedia(playerInstance.video);
    hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      hls.loadSource(url);
    });
  };


  ReactDOM.render(
      e(NPlayerReact, {
        style: { width: '100%', height: '100%' },
        onStreamLoad: handleStreamLoad,
        options: { src: url }
      }),
      document.querySelector('#app')
  );
}