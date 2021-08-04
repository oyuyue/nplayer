export enum TrackType {
  AUDIO = 'audio',
  VIDEO = 'video'
}

type TwoBit = 0 | 1 | 2 | 3;

export interface SampleFlag {
  isLeading: TwoBit;

  dependsOn: TwoBit;

  isDependedOn: TwoBit;

  hasRedundancy: TwoBit;

  isNonSyncSample: 0 | 1;

  paddingValue: number;

  degradationPriority: number;
}

export interface Sample {
  duration: number;

  flag: SampleFlag;

  size: number;

  cts: number;

  pts: number;
}

export interface VideoSample extends Sample {
  dts: number;

  isFrame: boolean;

  isKeyFrame: boolean;

  units: Uint8Array[];
}

export interface AudioSample extends Sample {
  data?: Uint8Array;
}

export interface Track {
  type: TrackType;

  id: number;

  pid: number;

  dropped: number;

  samples: Sample[];

  codec: string;

  baseMediaDecodeTime: number;

  duration: number;

  timescale: number;
}

export interface VideoTrack extends Track {
  profileIdc?: number;

  profileCompatibility?: number;

  levelIdc?: number;

  sarRatio: [number, number];

  sps: Uint8Array[];

  pps: Uint8Array[];

  width: number;

  height: number;

  samples: VideoSample[];
}

export interface AudioTrack extends Track {
  channelCount?: number;

  sampleRate?: number;

  objectType?: number;

  samplingFrequencyIndex?: number;

  sampleSize: number;

  samples: AudioSample[];
}

export type MixSample = VideoSample | AudioSample;

export type MixTrack = VideoTrack | AudioTrack;
