export function getDomOr<T extends HTMLElement>(
  dom: HTMLElement | string,
  orReturn?: T
): T {
  let ret: T = dom as T;
  if (typeof dom === 'string') ret = document.querySelector(dom);
  return ret || orReturn;
}
