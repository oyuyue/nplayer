export class M3U8Parser {
  parse(text: string, parentUrl: string) {
    if (!text) return;

    const lines = getLines(text);
  }
}

function getLines(text: string): string[] {
  return text.split(/[\r\n]/).map((x) => x.trim()).filter(Boolean);
}

function parseTag(text: string): void | [string, string] {
  const ret = text.match(/^#(EXT[^:]*)(?::(.*))?$/);
  if (!ret || !ret[1]) return;
  return [ret[1].replace('EXT-X-', ''), ret[2]];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function parseAttr(text: string): Record<string, any> {
  const reg = /([^=]+)=(?:"([^"]*)"|([^",]*))(?:,|$)/g;
  const ret: Record<string, any> = {};
  let match = reg.exec(text);
  while (match) {
    ret[match[1]] = match[2] || match[3];
    match = reg.exec(text);
  }
  return ret;
}

function getAbsoluteUrl(url: string, baseUrl: string) {
  if (!baseUrl || /^(?:[a-zA-Z0-9+\-.]+:)?\/\//.test(url)) return url;
  const pairs = /^((?:[a-zA-Z0-9+\-.]+:)?\/\/[^/?#]*)?([^?#]*\/)?([^/?#]*)?(\.[^/?#]*)?/.exec(baseUrl);
  if (!pairs) return url;
  if (url[0] === '/') return pairs[1] + url;
  return pairs[1] + pairs[2] + url;
}
