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

  pts: number;
}

export interface VideoSample extends Sample {
  dts: number;

  frame: boolean;

  key: boolean;

  cts: number;

  units: Uint8Array[];
}

export interface Track {
  container: string;

  type: TrackType;

  sequenceNumber: number;

  id: number;

  pid: number;

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

  dropped: number;

  width: number;

  height: number;

  samples: VideoSample[];

  pushSample(sample: VideoSample): boolean;
}
