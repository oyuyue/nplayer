export const isBrowser = typeof window !== 'undefined';
export const isIOS = isBrowser && /(iPad|iPhone|iPod)/gi.test(navigator.platform);
export const isIE = isBrowser && /MSIE|Trident/.test(navigator.userAgent);
export const isWin10IE = isBrowser && isIE && navigator.userAgent.indexOf('Windows NT 10.0') > -1;
