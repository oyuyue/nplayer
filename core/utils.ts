export function isFunction(o: any): o is Function {
  return typeof o === 'function';
}

export function isString(o: any): o is string {
  return typeof o === 'string';
}

export function noop() {}
