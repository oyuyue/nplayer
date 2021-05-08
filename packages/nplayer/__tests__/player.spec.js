import { Player } from '../src/ts/player'

describe('Player', () => {
  test('default options', () => {
    const player = new Player()
    const opts = player.opts;

    expect(opts.contextMenuToggle).toBe(true);
    expect(opts.shortcut).toBe(true);
    expect(opts.openEdgeInIE).toBe(true);
    expect(opts.posterEnable).toBe(true);
    expect(opts.seekStep).toBe(10);
    expect(opts.volumeStep).toBe(0.1);
    expect(opts.volumeBarWidth).toBe(100);
    expect(opts.controls).toEqual([
      ['play', 'volume', 'time', 'spacer', 'airplay', 'settings', 'web-fullscreen', 'fullscreen'],
      ['progress']
    ]);
    expect(opts.bpControls).toEqual({
      650: [
        ['play', 'progress', 'time', 'web-fullscreen', 'fullscreen'],
        [],
        ['spacer', 'airplay', 'settings'],
      ],
    });
    expect(opts.settings).toEqual(['speed']);
    expect(opts.contextMenus).toEqual(['loop', 'pip', 'version']);
    expect(opts.videoProps).toEqual({
      crossorigin: 'anonymous',
      preload: 'auto',
      playsinline: 'true',
    });

    const player2 = new Player({ live: true, isTouch: true })
    const opts2 = player2.opts;

    expect(opts2.controls).toEqual([
      ['play', 'time', 'spacer', 'airplay', 'settings', 'web-fullscreen', 'fullscreen'], []
    ]);
    expect(opts2.bpControls).toEqual({
      650: [
        ['play', 'time', 'web-fullscreen', 'fullscreen'],
        [],
        ['spacer', 'airplay', 'settings'],
      ],
    });
  })
})
