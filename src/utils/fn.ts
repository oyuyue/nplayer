export function throttle(fn: Function, ctx?: any): any {
  let pending = false;
  let first = true;
  let args: typeof arguments | null = null;
  return function () {
    args = arguments;
    if (first) {
      first = false;
      return fn.apply(ctx, args);
    }

    if (pending) return;
    pending = true;

    requestAnimationFrame(() => {
      fn.apply(ctx, args);
      pending = false;
    });
  };
}
