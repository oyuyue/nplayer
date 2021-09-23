const RE_ABSOLUTE_URL = /^(?:[a-zA-Z0-9+\-.]+:)?\/\//;
const RE_URL_PAIR = /^((?:[a-zA-Z0-9+\-.]+:)?\/\/[^/?#]*)?([^?#]*\/)?([^/?#]*)?(\.[^/?#]*)?/;
const RE_REL_URL = /^(\.{1,2}\/)+(.*)/;

export function resolveUrl(baseUrl: string, relativeUrl: string): string {
  if (!relativeUrl) return baseUrl;
  if (!baseUrl || RE_ABSOLUTE_URL.test(relativeUrl)) return relativeUrl;
  const pairs = RE_URL_PAIR.exec(baseUrl);
  if (!pairs) return relativeUrl;
  if (relativeUrl[0] === '/') return pairs[1] + relativeUrl;

  let path = pairs[2] + (pairs[3] ? `${pairs[3]}/` : '');

  if (relativeUrl[0] === '.') {
    const ret = RE_REL_URL.exec(relativeUrl);
    if (ret) {
      relativeUrl = ret[2];

      if (path) {
        const popNum = ret[1].split('/').reduce((a, c) => {
          if (c.length === 1) return a;
          return a + 1;
        }, 0);
        path = path.split('/').filter(Boolean).slice(0, -popNum).join('/');
        if (path) path = `/${path}/`;
      }
    }
  }

  return pairs[1] + (path || '/') + relativeUrl;
}
