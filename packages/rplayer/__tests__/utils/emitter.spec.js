import { EventEmitter } from '../../src/ts/utils'

describe('utils: emitter', () => {

  test('emit, on, once, off', () => {
    const emitter = new EventEmitter()
    const onFn = jest.fn()
    const onceFn = jest.fn()

    emitter.on('on', onFn)
    emitter.emit('on')
    expect(onFn).toHaveBeenCalledTimes(1)
    emitter.emit('on')
    expect(onFn).toHaveBeenCalledTimes(2)
    emitter.off('on', onFn)
    emitter.emit('on')
    expect(onFn).toHaveBeenCalledTimes(2)

    emitter.once('once', onceFn)
    emitter.emit('once')
    expect(onceFn).toHaveBeenCalledTimes(1)
    emitter.emit('once')
    expect(onceFn).toHaveBeenCalledTimes(1)
  })

  test('dispose', () => {
    const emitter = new EventEmitter()
    const onFn = jest.fn()
    const onceFn = jest.fn()

    const onDispose = emitter.on('on', onFn)
    expect(onDispose).toHaveProperty('dispose')
    onDispose.dispose()
    emitter.emit('on')
    expect(onFn).toHaveBeenCalledTimes(0)

    const onceDispose = emitter.on('once', onceFn)
    expect(onceDispose).toHaveProperty('dispose')
    onceDispose.dispose()
    emitter.emit('once')
    expect(onceFn).toHaveBeenCalledTimes(0)
  })

})
