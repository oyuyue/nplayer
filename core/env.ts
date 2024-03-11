export const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
export const isIOS = isBrowser && /(iPad|iPhone|iPod)/gi.test(navigator.platform);
