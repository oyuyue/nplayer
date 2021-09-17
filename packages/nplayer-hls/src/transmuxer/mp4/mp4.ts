import {
  AudioTrack, TrackType, VideoTrack, AudioSample, VideoSample,
} from '../domain';

type MixTrack = AudioTrack | VideoTrack
type MixSample = AudioSample | VideoSample

const UINT32_MAX = 2 ** 32 - 1;

export class MP4 {
  static types = [
    'avc1',
    'avcC',
    'dinf',
    'dref',
    'esds',
    'ftyp',
    'hdlr',
    'mdat',
    'mdhd',
    'mdia',
    'mfhd',
    'minf',
    'moof',
    'moov',
    'mp4a',
    'mvex',
    'mvhd',
    'pasp',
    'stbl',
    'stco',
    'stsc',
    'stsd',
    'stsz',
    'stts',
    'tfdt',
    'tfhd',
    'traf',
    'trak',
    'trun',
    'trex',
    'tkhd',
    'vmhd',
    'smhd',
  ].reduce((p, c) => (p[c] = [c.charCodeAt(0), c.charCodeAt(1), c.charCodeAt(2), c.charCodeAt(3)], p), Object.create(null));

  static HDLR_TYPES = {
    video: new Uint8Array([
      0x00, // version 0
      0x00, 0x00, 0x00, // flags
      0x00, 0x00, 0x00, 0x00, // pre_defined
      0x76, 0x69, 0x64, 0x65, // handler_type: 'vide'
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, // reserved
      0x56, 0x69, 0x64, 0x65, 0x6f, 0x48, 0x61,
      0x6e, 0x64, 0x6c, 0x65, 0x72, 0x00, // name: 'VideoHandler'
    ]),
    audio: new Uint8Array([
      0x00, // version 0
      0x00, 0x00, 0x00, // flags
      0x00, 0x00, 0x00, 0x00, // pre_defined
      0x73, 0x6f, 0x75, 0x6e, // handler_type: 'soun'
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, // reserved
      0x53, 0x6f, 0x75, 0x6e, 0x64, 0x48, 0x61,
      0x6e, 0x64, 0x6c, 0x65, 0x72, 0x00, // name: 'SoundHandler'
    ]),
  }

  static FTYP = MP4.box(MP4.types.ftyp, new Uint8Array([
    105, 115, 111, 109, // isom
    0, 0, 0, 1,
    105, 115, 111, 109,
    97, 118, 99, 49, // avc1
  ]))

  static DINF = MP4.box(MP4.types.dinf, MP4.box(MP4.types.dref, new Uint8Array([
    0x00, // version
    0x00, 0x00, 0x00, // flags
    0x00, 0x00, 0x00, 0x01, // entry_count
    0x00, 0x00, 0x00, 0x0c, // entry_size
    0x75, 0x72, 0x6c, 0x20, // 'url' type
    0x00, // version
    0x00, 0x00, 0x01, // entry_flags
  ])))

  static VMHD = MP4.box(MP4.types.vmhd, new Uint8Array([
    0x00, // version
    0x00, 0x00, 0x01, // flags
    0x00, 0x00, // graphics mode
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // op color
  ]))

  static SMHD = MP4.box(MP4.types.smhd, new Uint8Array([
    0x00, // version
    0x00, 0x00, 0x00, // flags
    0x00, 0x00, // balance
    0x00, 0x00, // reserved
  ]))

  private static StblTable = new Uint8Array([
    0x00, // version
    0x00, 0x00, 0x00, // flags
    0x00, 0x00, 0x00, 0x00, // entry_count
  ])

  static STTS = MP4.box(MP4.types.stts, MP4.StblTable)

  static STSC = MP4.box(MP4.types.stsc, MP4.StblTable)

  static STSZ = MP4.box(MP4.types.stsz, new Uint8Array([
    0x00, // version
    0x00, 0x00, 0x00, // flags
    0x00, 0x00, 0x00, 0x00, // sample_size
    0x00, 0x00, 0x00, 0x00, // sample_count
  ]))

  static STCO = MP4.box(MP4.types.stco, MP4.StblTable)

  static box(type: Uint8Array, ...payload: Uint8Array[]): Uint8Array {
    const size = 8 + payload.reduce((p, c) => (p + c.byteLength), 0);
    const ret = new Uint8Array(size);
    ret[0] = (size >> 24) & 0xff;
    ret[1] = (size >> 16) & 0xff;
    ret[2] = (size >> 8) & 0xff;
    ret[3] = size & 0xff;
    ret.set(type, 4);
    let offset = 8;
    payload.forEach((data) => {
      ret.set(data, offset);
      offset += data.byteLength;
    });
    return ret;
  }

  static initSegment(tracks: MixTrack[]): Uint8Array {
    const movie = MP4.moov(tracks);
    const ret = new Uint8Array(MP4.FTYP.byteLength + movie.byteLength);
    ret.set(MP4.FTYP);
    ret.set(movie, MP4.FTYP.byteLength);
    return ret;
  }

  static moov(tracks: MixTrack[]): Uint8Array {
    return MP4.box(MP4.types.moov,
      MP4.mvhd(tracks[0].duration, tracks[0].timescale),
      ...tracks.map((t) => MP4.trak(t)),
      MP4.mvex(tracks));
  }

  static mvhd(duration: number, timescale = 90000): Uint8Array {
    duration = duration || 0xffffffff;

    return MP4.box(MP4.types.mvhd, new Uint8Array([
      0x00, // version
      0x00, 0x00, 0x00, // flags
      0x00, 0x00, 0x00, 0x00, // creation_time
      0x00, 0x00, 0x00, 0x00, // modification_time
      (timescale >> 24) & 0xff, (timescale >> 16) & 0xff, (timescale >> 8) & 0xff, timescale & 0xff,
      (duration >> 24) & 0xff, (duration >> 16) & 0xff, (duration >> 8) & 0xff, duration & 0xff,
      0x00, 0x01, 0x00, 0x00, // rate
      0x01, 0x00, // volume
      0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, // reserved
      0x00, 0x01, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x01, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x40, 0x00, 0x00, 0x00, // matrix
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, // pre_defined
      0xff, 0xff, 0xff, 0xff, // next_track_ID
    ]));
  }

  static trak(track: MixTrack): Uint8Array {
    return MP4.box(
      MP4.types.trak,
      MP4.tkhd(track.id, track.duration, (track as VideoTrack).width, (track as VideoTrack).height),
      MP4.mdia(track),
    );
  }

  static tkhd(id: number, duration: number, width = 0, height = 0): Uint8Array {
    return MP4.box(MP4.types.tkhd, new Uint8Array([
      0x00, // version
      0x00, 0x00, 0x07, // flags
      0x00, 0x00, 0x00, 0x00, // creation_time
      0x00, 0x00, 0x00, 0x00, // modification_time
      (id >> 24) & 0xff, (id >> 16) & 0xff, (id >> 8) & 0xff, id & 0xff,
      0x00, 0x00, 0x00, 0x00,
      (duration >> 24) & 0xff, (duration >> 16) & 0xff, (duration >> 8) & 0xff, duration & 0xff,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // reserved
      0x00, 0x00, // layer
      0x00, 0x00, // alternate_group
      0x01, 0x00, // non-audio track volume
      0x00, 0x00, // reserved
      0x00, 0x01, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x01, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x40, 0x00, 0x00, 0x00, // matrix
      (width >> 8) & 0xff, width & 0xff, 0x00, 0x00,
      (height >> 8) & 0xff, height & 0xff, 0x00, 0x00,
    ]));
  }

  static mdia(track: MixTrack): Uint8Array {
    return MP4.box(MP4.types.mdia, MP4.mdhd(track.duration, track.timescale), MP4.hdlr(track.type), MP4.minf(track));
  }

  static mdhd(duration: number, timescale = 90000): Uint8Array {
    return MP4.box(MP4.types.mdhd, new Uint8Array([
      0x00, // version
      0x00, 0x00, 0x00, // flags
      0x00, 0x00, 0x00, 0x00, // creation_time
      0x00, 0x00, 0x00, 0x00, // modification_time
      (timescale >> 24) & 0xff, (timescale >> 16) & 0xff, (timescale >> 8) & 0xff, timescale & 0xff,
      (duration >> 24) & 0xff, (duration >> 16) & 0xff, (duration >> 8) & 0xff, duration & 0xff,
      0x55, 0xc4, // 'und' language (undetermined)
      0x00, 0x00, // pre_defined
    ]));
  }

  static hdlr(type: 'video' | 'audio'): Uint8Array {
    return MP4.box(MP4.types.hdlr, MP4.HDLR_TYPES[type]);
  }

  static minf(track: MixTrack): Uint8Array {
    return MP4.box(MP4.types.minf, track.type === 'video' ? MP4.VMHD : MP4.SMHD, MP4.DINF, MP4.stbl(track));
  }

  static stbl(track: MixTrack): Uint8Array {
    return MP4.box(MP4.types.stbl, MP4.stsd(track), MP4.STTS, MP4.STSC, MP4.STSZ, MP4.STCO);
  }

  static stsd(track: MixTrack): Uint8Array {
    return MP4.box(MP4.types.stsd, new Uint8Array([
      0x00, // version 0
      0x00, 0x00, 0x00, // flags
      0x00, 0x00, 0x00, 0x01, // entry_count
    ]), track.type === TrackType.VIDEO ? MP4.avc1(track as VideoTrack) : MP4.mp4a(track as AudioTrack));
  }

  static avc1(track: VideoTrack): Uint8Array {
    return MP4.box(MP4.types.avc1, new Uint8Array([
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // reserved
      0x00, 0x01, // data_reference_index
      0x00, 0x00, // pre_defined
      0x00, 0x00, // reserved
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // pre_defined
      (track.width >> 8) & 0xff, track.width & 0xff, // width
      (track.height >> 8) & 0xff, track.height & 0xff, // height
      0x00, 0x48, 0x00, 0x00, // horizresolution
      0x00, 0x48, 0x00, 0x00, // vertresolution
      0x00, 0x00, 0x00, 0x00, // reserved
      0x00, 0x01, // frame_count
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, // compressor name
      0x00, 0x18, // depth
      0x11, 0x11, // pre_defined = -1
    ]), MP4.avcC(track), MP4.pasp(track.sarRatio));
  }

  static avcC(track: VideoTrack): Uint8Array {
    const sps: number[] = [];
    const pps: number[] = [];

    let len;
    track.sps.forEach((s) => {
      len = s.byteLength;
      sps.push((len >>> 8) & 0xff);
      sps.push(len & 0xff);
      sps.push(...s);
    });

    track.pps.forEach((p) => {
      len = p.byteLength;
      pps.push((len >>> 8) & 0xff);
      pps.push(len & 0xff);
      pps.push(...p);
    });

    return MP4.box(MP4.types.avcC, new Uint8Array([
      0x01, // configurationVersion
      track.profileIdc!, // AVCProfileIndication
      track.profileCompatibility!, // profile_compatibility
      track.levelIdc!, // AVCLevelIndication
      0xfc | 3, // lengthSizeMinusOne
      0xe0 | track.sps.length, // 3bit reserved (111) + numOfSequenceParameterSets
    ].concat(sps)
      .concat([track.pps.length]) // numOfPictureParameterSets
      .concat(pps)));
  }

  static pasp([hSpacing, vSpacing]: [number, number]): Uint8Array {
    return MP4.box(MP4.types.pasp, new Uint8Array([
      hSpacing >> 24, (hSpacing >> 16) & 0xff, (hSpacing >> 8) & 0xff, hSpacing & 0xff,
      vSpacing >> 24, (vSpacing >> 16) & 0xff, (vSpacing >> 8) & 0xff, vSpacing & 0xff,
    ]));
  }

  static mp4a(track: AudioTrack): Uint8Array {
    return MP4.box(MP4.types.mp4a, new Uint8Array([
      0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, // reserved
      0x00, 0x01, // data_reference_index
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // reserved
      0x00, track.channelCount!,
      (track.sampleSize >> 8) & 0xff, track.sampleSize & 0xff,
      0x00, 0x00, // pre_defined
      0x00, 0x00, // reserved
      (track.sampleRate! >> 8) & 0xff, track.sampleRate! & 0xff,
      0x00, 0x00,
    ]), MP4.esds(track));
  }

  static esds(track: AudioTrack): Uint8Array {
    return MP4.box(MP4.types.esds, new Uint8Array([
      0x00, // version
      0x00, 0x00, 0x00, // flags
      0x03, // tag
      0x19, // length
      0x00, 0x00, // ES_ID
      0x00, // streamDependenceFlag, URL_flag, reserved, streamPriority
      0x04, // tag
      0x11, // length
      0x40, // object type
      0x15, // streamType
      0x00, 0x06, 0x00, // bufferSizeDB
      0x00, 0x00, 0xda, 0xc0, // maxBitrate
      0x00, 0x00, 0xda, 0xc0, // avgBitrate
      0x05, // tag, DecoderSpecificInfoTag
      0x02, // length
      (track.objectType! << 3) | (track.samplingFrequencyIndex! >>> 1),
      (track.samplingFrequencyIndex! << 7) | (track.channelCount! << 3),
      0x06, 0x01, 0x02, // GASpecificConfig
    ]));
  }

  static mvex(tracks: MixTrack[]): Uint8Array {
    return MP4.box(MP4.types.mvex, ...tracks.map((t) => MP4.trex(t.id)));
  }

  static trex(id: number): Uint8Array {
    return MP4.box(MP4.types.trex, new Uint8Array([
      0x00, // version
      0x00, 0x00, 0x00, // flags
      id >> 24, (id >> 16) & 0xff, (id >> 8) & 0xff, id & 0xff, // track_ID
      0x00, 0x00, 0x00, 0x01, // default_sample_description_index
      0x00, 0x00, 0x00, 0x00, // default_sample_duration
      0x00, 0x00, 0x00, 0x00, // default_sample_size
      0x00, 0x01, 0x00, 0x01, // default_sample_flags
    ]));
  }

  static moof(sequenceNumber: number, tracks: MixTrack[]): Uint8Array {
    return MP4.box(MP4.types.moof, MP4.mfhd(sequenceNumber), ...tracks.map((t) => MP4.traf(t)));
  }

  static mfhd(sequenceNumber: number): Uint8Array {
    return MP4.box(MP4.types.mfhd, new Uint8Array([
      0x00, // version
      0x00, 0x00, 0x00, // flags
      sequenceNumber >> 24, (sequenceNumber >> 16) & 0xff, (sequenceNumber >> 8) & 0xff, sequenceNumber & 0xff,
    ]));
  }

  static traf(track: MixTrack): Uint8Array {
    const offset = 16 // tfhd
                  + 20 // tfdt
                  + 8 // traf header
                  + 16 // mfhd
                  + 8 // moof header
                  + 8; // mdat header

    return MP4.box(MP4.types.traf, MP4.tfhd(track.id), MP4.tfdt(track.baseMediaDecodeTime), MP4.trun(track.samples, offset));
  }

  static tfhd(id: number): Uint8Array {
    return MP4.box(MP4.types.tfhd, new Uint8Array([
      0x00, // version 0
      0x00, 0x00, 0x00, // flags
      id >> 24, (id >> 16) & 0xff, (id >> 8) & 0xff, id & 0xff, // track_ID
    ]));
  }

  static tfdt(baseMediaDecodeTime: number): Uint8Array {
    const upperWordBaseMediaDecodeTime = Math.floor(baseMediaDecodeTime / (UINT32_MAX + 1));
    const lowerWordBaseMediaDecodeTime = Math.floor(baseMediaDecodeTime % (UINT32_MAX + 1));

    return MP4.box(MP4.types.tfdt, new Uint8Array([
      0x01, // version 1
      0x00, 0x00, 0x00, // flags
      upperWordBaseMediaDecodeTime >> 24,
      (upperWordBaseMediaDecodeTime >> 16) & 0xff,
      (upperWordBaseMediaDecodeTime >> 8) & 0xff,
      upperWordBaseMediaDecodeTime & 0xff,
      lowerWordBaseMediaDecodeTime >> 24,
      (lowerWordBaseMediaDecodeTime >> 16) & 0xff,
      (lowerWordBaseMediaDecodeTime >> 8) & 0xff,
      lowerWordBaseMediaDecodeTime & 0xff,
    ]));
  }

  static trun(samples: MixSample[], offset: number): Uint8Array {
    const sampleLen = samples.length;
    const dataLen = 12 + (16 * sampleLen);
    offset += 8 + dataLen;
    const data = new Uint8Array(dataLen);
    data.set([
      0x00, // version
      0x00, 0x0f, 0x01, // flags
      (sampleLen >>> 24) & 0xff, (sampleLen >>> 16) & 0xff, (sampleLen >>> 8) & 0xff, sampleLen & 0xff,
      (offset >>> 24) & 0xff, (offset >>> 16) & 0xff, (offset >>> 8) & 0xff, offset & 0xff, // data_offset
    ], 0);

    for (let i = 0; i < sampleLen; i++) {
      const {
        duration, size, flag, cts,
      } = samples[i] as VideoSample;

      data.set([
        (duration >>> 24) & 0xff, (duration >>> 16) & 0xff, (duration >>> 8) & 0xff, duration & 0xff,
        (size >>> 24) & 0xff, (size >>> 16) & 0xff, (size >>> 8) & 0xff, size & 0xff,
        (flag.isLeading! << 2) | (flag.dependsOn == null ? 1 : flag.dependsOn),
        (flag.isDependedOn! << 6) | (flag.hasRedundancy! << 4)
        | (flag.paddingValue! << 1) | (flag.isNonSyncSample == null ? 1 : flag.isNonSyncSample),
        flag.degradationPriority! & (0xf0 << 8), flag.degradationPriority! & 0x0f, // sample_flags
        (cts >>> 24) & 0xff, (cts >>> 16) & 0xff, (cts >>> 8) & 0xff, cts & 0xff, // sample_composition_time_offset
      ], 12 + 16 * i);
    }

    return MP4.box(MP4.types.trun, data);
  }

  static mdat(data: Uint8Array): Uint8Array {
    return MP4.box(MP4.types.mdat, data);
  }
}
