import { Fragment } from './fragment';

export function parseMedia(text = '', baseUrl = '') {
  const lines = getLines(text);
  const level: { frags: Fragment[] } = { frags: [] };

  let curSN = 0;
  let curCC = 0;
  let curFrag = new Fragment();
  let index = 0;
  let line;
  // eslint-disable-next-line no-cond-assign
  while (line = lines[index++]) {
    if (line[0] !== '#') {
      curFrag.url = getAbsoluteUrl(line, baseUrl);
      curFrag.cc = curCC;
      curFrag.sn = curSN;
      level.frags.push(curFrag);
      curFrag = new Fragment();
      curSN++;
      continue;
    }

    const ret = parseTag(line);
    if (!ret) continue;
    const [name, val] = ret;
    switch (name) {
      // case 'PLAYLIST-TYPE':
      //   level.type = val?.toUpperCase();
      //   break;
      // case 'TARGETDURATION':
      //   level.targetDuration = parseFloat(val);
      //   break;
      // case 'ENDLIST':
      //   level.live = false;
      //   break;
      case 'MEDIA-SEQUENCE':
        curSN = parseInt(val);
        break;
      case 'DISCONTINUITY-SEQUENCE':
        curCC = parseInt(val);
        break;
      case 'DISCONTINUITY':
        curCC++;
        break;
      case 'EXTINF': {
        const [duration, title] = val.split(',');
        curFrag.duration = parseFloat(duration);
        curFrag.title = title;
      }
        break;
      case 'BYTERANGE': {
        curFrag.byteRange = [];
        const bytes = val.split('@');
        if (bytes.length === 1) {
          curFrag.byteRange[0] = level.frags[level.frags.length - 1]?.byteRange?.[1] ?? 0;
        } else {
          curFrag.byteRange[0] = parseInt(bytes[1]);
        }
        curFrag.byteRange[1] = curFrag.byteRange[0] + parseInt(bytes[0]);
      }
        break;
      case 'KEY':
        break;
      case 'MAP':
        break;
    }
  }

  return level;
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
