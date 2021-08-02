export enum TrackType {
  AUDIO = 'audio',
  VIDEO = 'video'
}

export interface SampleFlag {
  isLeading: number;

  dependsOn: number;

  isDependedOn: number;

  hasRedundancy: number;

  paddingValue: number;

  isNonSyncSample: number;

  degradationPriority: number;
}

export interface Sample {
  duration: number;

  size: number;

  cts: number;

  flag: SampleFlag
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

  profileIdc: number;

  profileCompatibility: number;

  levelIdc: number;

  sps: Uint8Array[];

  pps: Uint8Array[];

  width: number;

  height: number;

  sarRatio: [number, number];

  channelCount: number;

  sampleSize: number;

  sampleRate: number;

  audioObjectType: number;

  samplingFrequencyIndex: number;
}
