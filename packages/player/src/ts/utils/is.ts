export function isString(o: any): o is string {
  return typeof o === 'string' || o instanceof String;
}

export function isBool(o: any): o is boolean {
  return o === true || o === false;
}

export function isFunction(o: any): o is Function {
  return typeof o === 'function';
}

export function isNumber(o: any): o is number {
  return typeof o === 'number';
}
