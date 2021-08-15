import { MP4 } from './mp4';
import { AudioTrack, VideoTrack } from './types';

export class MP4Remuxer {
  private initSegmentCreated = false;

  constructor(readonly videoTrack: VideoTrack, readonly audioTrack: AudioTrack) {
    this.videoTrack = videoTrack;
    this.audioTrack = audioTrack;
  }

  remux() {
    const ret: {
      video?: Uint8Array,
      audio?: Uint8Array,
      videoInitSegment?: Uint8Array,
      audioInitSegment?: Uint8Array
    } = {};

    if (!this.initSegmentCreated) {
      const initSegment = this.createInitSegment(video, audio);
      ret.videoInitSegment = initSegment.video;
      ret.audioInitSegment = initSegment.audio;
      this.initSegmentCreated = true;
    }

    ret.video = this.remuxVideo(video);
    ret.audio = this.remuxAudio(audio);

    video.samples = [];
    audio.samples = [];

    return ret;
  }

  createInitSegment(videoTrack: VideoTrack, audioTrack: AudioTrack) {
    videoTrack.duration *= videoTrack.timescale;

    audioTrack.timescale = audioTrack.sampleRate!;
    audioTrack.duration *= audioTrack.timescale;

    const videoInitSegment = MP4.initSegment([videoTrack]);
    const audioInitSegment = MP4.initSegment([audioTrack]);

    return {
      video: videoInitSegment,
      audio: audioInitSegment,
    };
  }

  remuxVideo(track: VideoTrack) {
    let mdatSize = 0;
    track.samples.forEach((s) => {
      mdatSize += s.units.reduce((t, c) => (t + c.byteLength), 0);
      mdatSize += (s.units.length * 4);
    });

    const mdatData = new Uint8Array(mdatSize);
    const mdatView = new DataView(mdatData.buffer);

    for (let i = 0, l = track.samples.length, offset = 0, sample, nextSample; i < l; i++) {
      sample = track.samples[i];
      nextSample = track.samples[i + 1];

      if (nextSample) {
        sample.duration = nextSample.dts - sample.dts;
      } else {
        sample.duration = track.samples[i - 1]?.duration || 0;
      }

      let sampleSize = 0;
      sample.units.forEach((u) => {
        mdatView.setUint32(offset, u.byteLength);
        offset += 4;
        mdatData.set(u, offset);
        offset += u.byteLength;
        sampleSize += (4 + u.byteLength);
      });
      sample.size = sampleSize;
    }

    const mdat = MP4.mdat(mdatData);
    const moof = MP4.moof(1, [track]);

    const chunk = new Uint8Array(moof.byteLength + mdat.byteLength);
    chunk.set(moof);
    chunk.set(mdat, moof.byteLength);

    return chunk;
  }

  remuxAudio(track: AudioTrack) {
    const moof = MP4.moof(0, [track]);
    const mdatData = new Uint8Array(track.samples.reduce((t, c) => (t + c.size), 0));
    track.samples.reduce((offset, s) => (mdatData.set(s.data, offset), offset + s.size), 0);
    const mdat = MP4.mdat(mdatData);

    const chunk = new Uint8Array(moof.byteLength + mdat.byteLength);
    chunk.set(moof);
    chunk.set(mdat, moof.byteLength);

    return chunk;
  }
}
