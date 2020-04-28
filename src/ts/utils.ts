export function getDomOr<T extends HTMLElement>(
  dom: HTMLElement | string,
  orReturn?: T
): T {
  let ret: T = dom as T;
  if (typeof dom === 'string') ret = document.querySelector(dom);
  return ret || orReturn;
}

export function clamp(n: number, lower = 0, upper = 1): number {
  return Math.max(Math.min(n, upper), lower);
}

export function isStr(o: any): o is string {
  return typeof o === 'string';
}
