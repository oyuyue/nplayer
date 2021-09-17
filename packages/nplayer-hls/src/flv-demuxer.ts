import { AudioSample, AudioTrack } from './audio-track';
import { AAC } from './aac';
import { VideoTrack } from './types';

export class FlvDemuxer {
  static readonly SoundRateTable = [5500, 11025, 22050, 44100];

  constructor(readonly videoTrack: VideoTrack, readonly audioTrack: AudioTrack) {
    this.videoTrack = videoTrack;
    this.audioTrack = audioTrack;
  }

  demux(data: Uint8Array) {
    const dataLen = data.byteLength;
    let offset = 0;

    offset = (data[5] << 24) | (data[6] << 16) | (data[7] << 8) | (data[8]);

    offset += 4;

    while (offset < dataLen) {
      const type = data[offset];
      const size = (data[offset + 1] << 16) | (data[offset + 2] << 8) | (data[offset + 3]);
      const timestamp = (data[offset + 7] << 24) | (data[offset + 4] << 16) | (data[offset + 5] << 8) | (data[offset + 6]);

      const bodyData = new Uint8Array(data.buffer, offset + 11, size);

      switch (type) {
        case 8:
          this.parseAudio(bodyData, timestamp);
          break;
        case 9:
          this.parseVideo(bodyData, timestamp);
          break;
        case 18:
          this.parseScript();
          break;
      }

      offset += 11 + size + 4;
    }
  }

  private parseAudio(data: Uint8Array, pts: number) {
    const format = data[0] & 0b11110000;

    if (format !== 2 && format !== 10) {
      // Unsupported
    }

    this.audioTrack.sampleRate = FlvDemuxer.SoundRateTable[data[0] & 0b00001100];
    this.audioTrack.channelCount = data[0] & 0b00000001 + 1;

    if (format === 10) { // AAC
      const packetType = data[1];
      const audioData = new Uint8Array(data.buffer, 2, data.length - 2);
      if (packetType === 0) {
        const spec = AAC.parseSpec(audioData);
        if (spec) {
          this.audioTrack.codec = spec.codec;
          this.audioTrack.channelCount = spec.channelCount;
          this.audioTrack.objectType = spec.objectType;
          this.audioTrack.sampleRate = spec.sampleRate;
          this.audioTrack.samplingFrequencyIndex = spec.samplingFrequencyIndex;
        }
      } else if (packetType === 1) {
        this.audioTrack.samples.push(new AudioSample(pts, audioData));
      }
    } else { // MP3

    }
  }

  private parseVideo(data: Uint8Array, pts: number) {
    const frameType = data[0] & 0b11110000;
    const codecId = data[0] & 0b00001111;

    if (codecId !== 7) { // Unsupported
      return;
    }

    const packetType = data[1];

    if (packetType === 0) {
      //
    } else if (packetType === 1) {
      const cts = ((data[2] << 16) | (data[3] << 8) | (data[4]) << 8) >> 8;
    }
  }

  private parseScript() {}

  static probe(data: Uint8Array): boolean {
    if (data.length < 9) return false;
    return data[0] === 0x46 && data[1] === 0x4c && data[2] === 0x56 && !(data[4] & 0xfa);
  }
}
