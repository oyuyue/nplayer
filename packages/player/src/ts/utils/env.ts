export const isEdge = window.navigator.userAgent.indexOf('Edge') > -1;
export const isIOS = /(iPad|iPhone|iPod)/gi.test(navigator.platform);
export const isIE = /MSIE|Trident/.test(navigator.userAgent);
export const isBrowser = typeof window !== 'undefined';
