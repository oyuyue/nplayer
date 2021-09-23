import { Stream, Audio } from '../streaming/types';
import { HlsSegment } from './segment';

export class HlsStream implements Stream {
  url?: string;

  bitrate?: number;

  codes?: string;

  width?: number;

  height?: number;

  fps?: number;

  videoCodec?: string;

  audioCodec?: string;

  canSkipUntil?: number;

  totalDuration = 0;

  canSkipDateranges = false;

  canBlockReload = false;

  audios: Audio[] = [];

  renditionReports: { url: string; lastSn: number; lastPart?: number }[]= [];

  segments: HlsSegment[] = [];
}
