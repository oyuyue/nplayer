import { isBool, isFunction, isNumber, isString } from '../../src/ts/utils'

describe('utils: is', () => {

  test('isString', () => {
    expect(isString('str')).toBe(true)
    expect(isString(new String('str'))).toBe(true)
    expect(isString(true)).toBe(false)
    expect(isString({})).toBe(false)
    expect(isString(1)).toBe(false)
  })

  test('isBool', () => {
    expect(isBool(true)).toBe(true)
    expect(isBool(false)).toBe(true)
    expect(isBool(new Boolean(true))).toBe(true)
    expect(isBool(0)).toBe(false)
    expect(isBool('str')).toBe(false)
    expect(isBool({})).toBe(false)
  })

  test('isFunction', () => {
    expect(isFunction(() => {})).toBe(true)
    expect(isFunction(async () => {})).toBe(true)
    expect(isFunction(class A {})).toBe(true)
    expect(isFunction(function *B() {})).toBe(true)
    expect(isFunction({})).toBe(false)
    expect(isFunction(1)).toBe(false)
    expect(isFunction('str')).toBe(false)
    expect(isFunction(null)).toBe(false)
  })

  test('isNumber', () => {
    expect(isNumber(1)).toBe(true)
    expect(isNumber(Infinity)).toBe(true)
    expect(isNumber(NaN)).toBe(true)
    expect(isNumber(-1)).toBe(true)
    expect(isNumber(0)).toBe(true)
    expect(isNumber(new Number())).toBe(true)
    expect(isNumber(0x1)).toBe(true)
    expect(isNumber('1')).toBe(false)
    expect(isNumber(true)).toBe(false)
    expect(isNumber(() => {})).toBe(false)
  })

})
