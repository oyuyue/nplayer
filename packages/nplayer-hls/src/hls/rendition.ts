import { Rendition, Subtitle } from '../streaming/types';
import { HlsStream } from './stream';

export class HlsRendition implements Rendition {
  dynamic = true;

  start = 0;

  startPrecise?: boolean;

  segmentDuration?: number;

  delay?: number;

  streams: HlsStream[] = [];

  subtitles: Subtitle[] = [];
}
