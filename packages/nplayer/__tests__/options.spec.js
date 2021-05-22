import { processOptions } from '../src/ts/options'

describe('Player Options', () => {
  test('default options', () => {
    const opts = processOptions()

    expect(opts.shortcut).toBe(true)
    expect(opts.seekStep).toBe(10)
    expect(opts.volumeStep).toBe(0.1)
    expect(opts.volumeBarWidth).toBe(100)
    expect(opts.settings).toEqual(['speed'])
    expect(opts.contextMenus).toEqual(['loop', 'pip', 'version'])
    expect(opts.contextMenuToggle).toBe(true)
    expect(opts.openEdgeInIE).toBe(true)
    expect(opts.posterEnable).toBe(true)
    expect(opts.videoProps).toEqual({
      crossorigin: 'anonymous',
      preload: 'auto',
      playsinline: 'true',
    })
    expect(opts.controls).toEqual([
      ['play', 'volume', 'time', 'spacer', 'airplay', 'settings', 'web-fullscreen', 'fullscreen'],
      ['progress'],
    ])
    expect(opts.bpControls).toEqual({
      650: [
        ['play', 'progress', 'time', 'web-fullscreen', 'fullscreen'],
        [],
        ['spacer', 'airplay', 'settings'],
      ],
    })
  })

  test('override options', () => {
    const custom = {
      controls: [['', false, 'controls', 0], undefined, false],
      bpControls: { 100: [['', false, 'bpControls', 0], undefined, 0] },
      settings: [],
      contextMenus: [],
      videoProps: {
        z: 'z'
      }
    }
    const opts = processOptions(custom)

    expect(opts.controls).toEqual([['controls']])
    expect(opts.bpControls).toEqual({ 100: [['bpControls']] })
    expect(opts.settings).toEqual([])
    expect(opts.contextMenus).toEqual([])
    expect(opts.videoProps).toEqual({
      crossorigin: 'anonymous',
      preload: 'auto',
      playsinline: 'true',
      z: 'z'
    })
  })

  test('share options', () => {
    const opts1 = processOptions()
    const opts2 = processOptions()

    opts1.videoProps.a = '1'
    opts1.settings[0] = '1'
    opts1.shortcut = false

    expect(opts2.videoProps.a).toBeUndefined()
    expect(opts2.settings[0]).not.toBe('1')
    expect(opts2.shortcut).toBe(true)
  })

})
