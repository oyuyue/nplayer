import { Player } from '../src/ts/player'

describe('Player', () => {
  test('default options', () => {
    const player = new Player()
    const opts = player.opts;
    expect(opts.clickPause).toBe(true);
    expect(opts.contextMenuToggle).toBe(true);
    expect(opts.shortcut).toBe(true);
    expect(opts.dblclickFullscreen).toBe(true);
    expect(opts.openEdgeInIE).toBe(true);
    expect(opts.posterEnable).toBe(true);
    expect(opts.seekStep).toBe(10);
    expect(opts.volumeStep).toBe(0.1);
    expect(opts.volumeBarWidth).toBe(100);
    expect(opts.controls).toEqual(['play', 'volume', 'time', 'spacer', 'airplay', 'settings', 'web-fullscreen', 'fullscreen']);
    expect(opts.settings).toEqual(['speed']);
    expect(opts.contextMenus).toEqual(['loop', 'pip', 'version']);
    expect(opts.videoAttrs).toEqual({
      crossorigin: 'anonymous',
      preload: 'auto',
      playsinline: 'true',
    });
  })
})
