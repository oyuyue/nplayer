export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  wait = 1000
): any {
  let pending = false;

  return function (...args: Parameters<typeof fn>): void {
    if (pending) return;
    pending = true;
    setTimeout(() => {
      fn.apply(this, args);
      pending = false;
    }, wait);
  };
}
