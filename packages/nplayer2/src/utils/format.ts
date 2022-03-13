function padStart(v: string | number, len = 2, str = '0'): string {
  v = String(v);
  if (v.length >= len) return v;

  for (let i = 0, l = len - v.length; i < l; i++) {
    v = str + v;
  }

  return v;
}

export function formatTime(seconds: number): string {
  // eslint-disable-next-line no-restricted-globals
  if (!isFinite(seconds) || isNaN(seconds)) return '';
  if (!seconds) return '0:00';
  const isNeg = seconds < 0;
  if (isNeg) seconds *= -1;

  let ret: string;

  seconds = Math.round(seconds);
  if (seconds < 60) {
    ret = `0:${padStart(seconds)}`;
  } else if (seconds < 3600) {
    ret = `${~~(seconds / 60)}:${padStart(seconds % 60)}`;
  } else {
    ret = `${~~(seconds / 3600)}:${padStart(
      ~~((seconds % 3600) / 60),
    )}:${padStart(seconds % 60)}`;
  }

  if (isNeg) ret = `-${ret}`;

  return ret;
}

export function clamp(n: number, lower = 0, upper = 1): number {
  return Math.max(Math.min(n, upper), lower);
}
