export function isFunction(o: any): o is Function {
  return typeof o === 'function';
}

export function noop() {}
