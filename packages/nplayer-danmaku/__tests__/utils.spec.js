import { isDefaultColor, createTimer, EVENT } from '../src/ts/utils'

let DateNow;

describe('utils', () => {

  afterAll(() => {
    DateNow.mockRestore();
  })

  test('isDefaultColor', () => {
    expect(isDefaultColor('#000')).toBe(false)
    expect(isDefaultColor('str')).toBe(false)
    expect(isDefaultColor(true)).toBe(false)
    expect(isDefaultColor(1)).toBe(false)
    expect(isDefaultColor(false)).toBe(true)
    expect(isDefaultColor(0)).toBe(true)
    expect(isDefaultColor('')).toBe(true)
    expect(isDefaultColor('#fff')).toBe(true)
    expect(isDefaultColor('#FFF')).toBe(true)
    expect(isDefaultColor('#ffffff')).toBe(true)
    expect(isDefaultColor('#FFFFFF')).toBe(true)
  })

  test('timer', () => {
    DateNow = jest.spyOn(Date, 'now').mockImplementation(() => 1000)
    const timer = createTimer()
    const now1 = timer.now()
    expect(now1).toBe(1)
    DateNow = jest.spyOn(Date, 'now').mockImplementation(() => 2000)
    const now2 = timer.now()
    expect(now1).not.toBe(now2)
    timer.pause()
    DateNow = jest.spyOn(Date, 'now').mockImplementation(() => 3000)
    expect(timer.now()).toBe(now2)
    timer.play()
    expect(timer.now()).toBe(2)
  })

  test('EVENT', () => {
    expect(EVENT.DANMAKU_SEND).toBe('DanmakuSend')
    expect(EVENT.DANMAKU_UPDATE_OPTIONS).toBe('DanmakuUpdateOptions')
  })

})
