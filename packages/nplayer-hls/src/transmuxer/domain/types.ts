export const TrackType = {
  VIDEO: 'video',
  AUDIO: 'audio',
} as const;

type TwoBit = 0 | 1 | 2 | 3;

export interface SampleFlag {
  isLeading?: TwoBit;

  dependsOn?: TwoBit;

  isDependedOn?: TwoBit;

  hasRedundancy?: TwoBit;

  isNonSyncSample?: 0 | 1;

  paddingValue?: number;

  degradationPriority?: number;
}
