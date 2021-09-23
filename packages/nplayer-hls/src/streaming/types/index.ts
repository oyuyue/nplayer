export interface Subtitle {
  url: string;

  language?: string;

  name?: string;

  default?: boolean;

  characteristics?: string[];
}

export interface Audio {
  url: string;

  language?: string;

  name?: string;

  default?: boolean;

  channels?: number;

  codec?: string;
}

export interface Segment {
  url: string;

  start: number;

  duration: number;

  end: number;

  sn: number;

  periodId: number;

  byteRange?: [number, number];

  title?: string;

  wallClockTime?: number;

  invalid?: boolean;
}

export interface Stream {
  url?: string;

  totalDuration?: number;

  bitrate?: number;

  codes?: string;

  width?: number;

  height?: number;

  fps?: number;

  videoCodec?: string;

  audioCodec?: string;

  audios: Audio[];
}

export interface Rendition {
  dynamic: boolean;

  start?: number;

  startPrecise?: boolean;

  segmentDuration?: number;

  delay?: number;

  streams: Stream[];

  subtitles: Subtitle[];
}
