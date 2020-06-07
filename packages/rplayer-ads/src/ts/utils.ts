import RPlayer from 'rplayer';

export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  wait = 1000
): any {
  let pending = false;
  let first = true;

  return function (...args: Parameters<typeof fn>): void {
    if (pending) return;
    if (first) {
      first = false;
      return fn.apply(this, args);
    }
    pending = true;
    setTimeout(() => {
      fn.apply(this, args);
      pending = false;
    }, wait);
  };
}

export function getAdBadge(player: RPlayer): HTMLElement {
  const ad = RPlayer.utils.newElement('rplayer_ad_badge');
  ad.innerText = player.t('AD');
  return ad;
}

export function openInNewTab(src: string): void {
  window.open(src, '_blank').focus();
}
