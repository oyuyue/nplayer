import { HlsRendition } from './rendition';
import { HlsSegment } from './segment';
import { HlsStream } from './stream';
import { resolveUrl } from '../utils';

export interface M3u8Media {
  type: 'audio' | 'subtitles';
  url: string;
  groupId?: string;
  language?: string;
  name?: string;
  default?: boolean;
  autoselect?: boolean;
  channels?: number;
  characteristics?: string[];
}

export interface M3u8Stream {
  url: string;
  bitrate?: number;
  fps?: number;
  width?: number;
  height?: number;
  audioGroupId?: string;
  videoCodec?: string;
  audioCodec?: string;
}

export class M3U8Parser {
  parse(text: string, parentUrl: string, rendition: HlsRendition) {
    if (!text) return;
    const lines = getLines(text);
    if (!lines.length || !lines.includes('#EXTM3U')) return;

    if (text.indexOf('#EXTINF:') > 0 || text.indexOf('#EXT-X-TARGETDURATION:') > 0) {
      this.parseMedia(lines, parentUrl, rendition);
    } else {
      this.parseMaster(lines, parentUrl);
    }
  }

  private parseMaster(lines: string[], parentUrl: string): HlsRendition {
    const rendition = new HlsRendition();
    const streams: M3u8Stream[] = [];
    const medias: M3u8Media[] = [];

    let index = 0;
    let line;
    // eslint-disable-next-line no-cond-assign
    while (line = lines[index++]) {
      if (line[0] !== '#') continue;

      const tag = parseTag(line);
      if (!tag) continue;
      const [name, val] = tag;
      switch (name) {
        case 'MEDIA': {
          const attrs = parseAttr(val);
          if (!attrs.TYPE || !attrs.URI || (attrs.TYPE !== 'AUDIO' && attrs.TYPE !== 'SUBTITLES')) break;
          const media: M3u8Media = {
            type: attrs.TYPE.toLowerCase() as any,
            url: resolveUrl(parentUrl, attrs.URI),
            groupId: attrs['GROUP-ID'],
            language: attrs.LANGUAGE,
            name: attrs.NAME,
            default: attrs.DEFAULT === 'YES',
          };
          if (attrs.CHARACTERISTICS) {
            media.characteristics = attrs.CHARACTERISTICS.split(',');
          }
          if (attrs.CHANNELS) {
            media.channels = parseInt(attrs.CHANNELS.split('/')[0], 10);
          }
          medias.push(media);
        }
          break;
        case 'STREAM-INF': {
          const url = lines[index++];
          if (!url) break;
          const attrs = parseAttr(val);
          const stream: M3u8Stream = { url: resolveUrl(parentUrl, url) };
          stream.bitrate = parseInt(attrs['AVERAGE-BANDWIDTH'] || attrs.BANDWIDTH || '0');
          if (attrs['FRAME-RATE']) stream.fps = parseInt(attrs['FRAME-RATE']);
          if (attrs.AUDIO) stream.audioGroupId = attrs.AUDIO;
          if (attrs.RESOLUTION) {
            const resolution = attrs.RESOLUTION.split('x').map((x) => parseInt(x));
            stream.width = resolution[0];
            stream.height = resolution[1];
          }
          if (attrs.CODECS) {
            const codecs = attrs.CODECS.split(',').map((x) => x.trim());
            stream.videoCodec = getCodec(codecs, 'video');
            stream.audioCodec = getCodec(codecs, 'audio');
          }
          streams.push(stream);
        }
          break;
        case 'START': {
          const attrs = parseAttr(val);
          if (attrs['TIME-OFFSET']) {
            rendition.start = parseFloat(attrs['TIME-OFFSET']);
          }
          rendition.startPrecise = attrs.PRECISE === 'YES';
        }
          break;
      }
    }

    streams.forEach((s) => {
      const stream = new HlsStream();
      stream.url = s.url;
      stream.bitrate = s.bitrate;
      stream.fps = s.fps;
      stream.width = s.width;
      stream.height = s.height;
      stream.videoCodec = s.videoCodec;
      stream.audioCodec = s.audioCodec;

      if (s.audioGroupId) {
        medias.filter((m) => m.groupId === s.audioGroupId && m.type === 'audio').forEach((a) => {
          stream.audios.push({
            url: a.url,
            language: a.language,
            name: a.name,
            default: a.default,
            channels: a.channels,
            codec: stream.audioCodec,
          });
        });
      }

      rendition.streams.push(stream);
    });

    medias.filter((m) => m.type === 'subtitles').forEach((s) => {
      rendition.subtitles.push({
        url: s.url,
        language: s.language,
        name: s.name,
        default: s.default,
        characteristics: s.characteristics,
      });
    });

    return rendition;
  }

  private parseMedia(lines: string[], parentUrl: string, rendition: HlsRendition, stream?: HlsStream): HlsStream {
    stream = stream || new HlsStream();
    const segments = stream.segments;
    const lastSegment = segments[segments.length - 1];

    let prevSegment = lastSegment;
    let segment = new HlsSegment();
    let curSN = 0;
    let curPeriodId = 0;
    let totalDuration = 0;

    let index = 0;
    let line;
    // eslint-disable-next-line no-cond-assign
    while (line = lines[index++]) {
      if (line[0] !== '#') {
        if (!lastSegment || lastSegment.sn < curSN) {
          segment.url = resolveUrl(parentUrl, line);
          segment.periodId = curPeriodId;
          segment.sn = curSN;
          if (!segment.wallClockTime && prevSegment && prevSegment.wallClockTime) {
            segment.wallClockTime = prevSegment.wallClockTime + prevSegment.duration * 1000;
          }
          segments.push(segment);
        }
        segment = new HlsSegment();
        prevSegment = segment;
        curSN++;
        continue;
      }

      const tag = parseTag(line);
      if (!tag) continue;
      const [name, val] = tag;
      switch (name) {
        case 'TARGETDURATION':
          rendition.segmentDuration = parseFloat(val);
          break;
        case 'ENDLIST':
          rendition.dynamic = false;
          break;
        case 'MEDIA-SEQUENCE':
          curSN = parseInt(val);
          break;
        case 'DISCONTINUITY-SEQUENCE':
          curPeriodId = parseInt(val);
          break;
        case 'DISCONTINUITY':
          curPeriodId++;
          break;
        case 'EXTINF': {
          const [duration, title] = val.split(',');
          segment.duration = parseFloat(duration);
          segment.start = totalDuration;
          totalDuration += segment.duration;
          segment.title = title;
        }
          break;
        case 'BYTERANGE': {
          segment.byteRange = [0, 0];
          const bytes = val.split('@');
          if (bytes.length === 1) {
            segment.byteRange[0] = prevSegment?.byteRange?.[1] || 0;
          } else {
            segment.byteRange[0] = parseInt(bytes[1]);
          }
          segment.byteRange[1] = segment.byteRange[0] + parseInt(bytes[0]);
        }
          break;
        case 'BITRATE':
          if (!stream.bitrate) stream.bitrate = parseInt(val);
          break;
        case 'KEY':
          break;
        case 'MAP':
          break;
        case 'PROGRAM-DATE-TIME': {
          const wallClockTime = Date.parse(val);
          // eslint-disable-next-line no-restricted-globals
          if (!isNaN(wallClockTime)) {
            segment.wallClockTime = wallClockTime;
          }
        }
          break;
        case 'GAP':
          segment.invalid = true;
          break;
        case 'PART':
          break;
        case 'PART-INF':
          break;
        case 'SERVER-CONTROL': {
          const attrs = parseAttr(val);
          if (attrs['PART-HOLD-BACK']) {
            rendition.delay = parseFloat(attrs['PART-HOLD-BACK']);
          } else if (attrs['HOLD-BACK']) {
            rendition.delay = parseFloat(attrs['HOLD-BACK']);
          }
          if (attrs['CAN-SKIP-UNTIL']) {
            stream.canSkipUntil = parseFloat(attrs['CAN-SKIP-UNTIL']);
          }
          if (attrs['CAN-SKIP-DATERANGES'] === 'YES') {
            stream.canSkipDateranges = true;
          }
          if (attrs['CAN-BLOCK-RELOAD'] === 'YES') {
            stream.canBlockReload = true;
          }
        }
          break;
        case 'START': {
          if (rendition.start) break;
          const attrs = parseAttr(val);
          if (attrs['TIME-OFFSET']) {
            rendition.start = parseFloat(attrs['TIME-OFFSET']);
          }
          rendition.startPrecise = attrs.PRECISE === 'YES';
        }
          break;
        case 'SKIP': {
          const attrs = parseAttr(val);
          if (attrs['SKIPPED-SEGMENTS']) {
            curSN += parseInt(attrs['SKIPPED-SEGMENTS']);
          }
        }
          break;
        case 'PRELOAD-HINT':
          break;
        case 'RENDITION-REPORT':
          break;
        case 'PREFETCH-DISCONTINUITY':
          break;
        case 'PREFETCH':
          break;
      }
    }

    return stream;
  }
}

const RE_LINE_SEP = /[\r\n]/;
const RE_TAG = /^#(EXT[^:]*)(?::(.*))?$/;
const RE_ATTR = /([^=]+)=(?:"([^"]*)"|([^",]*))(?:,|$)/g;
const RE_CODECS = {
  video: [/^avc/, /^hev/, /^hvc/, /^vp0?[89]/, /^av1$/],
  audio: [/^vorbis$/, /^opus$/, /^mp4a/, /^[ae]c-3$/],
} as const;

function getLines(text: string): string[] {
  return text.split(RE_LINE_SEP).map((x) => x.trim()).filter(Boolean);
}

function parseTag(text: string): void | [string, string] {
  const tag = text.match(RE_TAG);
  if (!tag || !tag[1]) return;
  return [tag[1].replace('EXT-X-', ''), tag[2]];
}

function parseAttr(text: string): Record<string, string> {
  const ret: Record<string, any> = {};
  let match = RE_ATTR.exec(text);
  while (match) {
    ret[match[1]] = match[2] || match[3];
    match = RE_ATTR.exec(text);
  }
  return ret;
}

function getCodec(codecs: string[], type: keyof typeof RE_CODECS): undefined | string {
  const re = RE_CODECS[type];
  if (!re || !codecs) return;
  let codec: string;
  for (let i = 0; i < re.length; i++) {
    for (let j = 0; j < codecs.length; j++) {
      codec = codecs[j];
      if (!codec) continue;
      if (re[i].test(codec)) return codec;
    }
  }
}
