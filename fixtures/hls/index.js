window.onload = function () {
  const hls = new NPlayerHls()
  // hls.load('https://test-streams.mux.dev/x36xhzz/url_0/193039199_mp4_h264_aac_hd_7.m3u8')
  fetch('./hls/0.ts')
  .then((res) => res.arrayBuffer())
  .then((buffer) => {
    console.log(hls.transmux(new Uint8Array(buffer), { start: 0 }))
  });
}
