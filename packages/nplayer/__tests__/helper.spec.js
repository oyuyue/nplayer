jest.mock('../src/ts/utils/env', () => ({ isWin10IE: true }))

import { Player } from '../src/ts/player'
import { EVENT } from '../src/ts/constants'
import { tryOpenEdge } from '../src/ts/helper'

describe('Player helper', () => {

  test('tryOpenEdge', () => {
    window.location.assign = jest.fn();
    const player = new Player()
    const cb = jest.fn()
    player.on(EVENT.OPEN_EDGE, cb)
    const doc = jest.spyOn(document, 'URL', 'get').mockReturnValue('123')
    tryOpenEdge(player)
    expect(cb).toHaveBeenCalledTimes(1)
    expect(window.location.assign).toHaveBeenCalledWith('microsoft-edge:123')
    doc.mockRestore()
    window.location.assign.mockRestore()
  })

})
