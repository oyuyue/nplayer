export enum TrackType {
  AUDIO = 'audio',
  VIDEO = 'video'
}

export interface Track {
  type: TrackType;

  pid: number;

  dropped: number;

  samples: Object[];

  codec: string;
}
