export const isBrowser = typeof window !== 'undefined';
export const isIOS = isBrowser && /(iPad|iPhone|iPod)/gi.test(navigator.platform);
