export class ADTS {
  static FREQ = [
    96000,
    88200,
    64000,
    48000,
    44100,
    32000,
    24000,
    22050,
    16000,
    12000,
    11025,
    8000,
    7350,
  ];

  static parse(data: Uint8Array, pts: number, frameIndex = 0) {
    const len = data.length;
    let i = 0;

    while ((i + 2) < len) {
      if (data[i] === 0xff && (data[i + 1] & 0xf6) === 0xf0) {
        break;
      }
      i++;
    }

    if (i >= len) return;

    const skip = i;
    const frames = [];
    const objectType = ((data[i + 2] & 0xc0) >>> 6) + 1;
    const channelCount = ((data[i + 2] & 1) << 2) | ((data[i + 3] & 0xc0) >>> 6);
    const samplingFrequencyIndex = (data[i + 2] & 0x3c) >>> 2;
    const sampleRate = ADTS.FREQ[samplingFrequencyIndex];
    const sampleCount = ((data[i + 6] & 0x03) + 1) * 1024;

    let protectionSkipBytes;
    let frameLength;
    let duration;

    while ((i + 7) < len) {
      if ((data[i] !== 0xff) || (data[i + 1] & 0xF6) !== 0xf0) {
        i++;
        continue;
      }

      frameLength = ((data[i + 3] & 0x03) << 11) | (data[i + 4] << 3) | ((data[i + 5] & 0xe0) >> 5);
      if ((len - i) < frameLength) break;

      protectionSkipBytes = (~data[i + 1] & 0x01) * 2;
      duration = (sampleCount * 90000) / sampleRate;
      frames.push({
        pts: pts + frameIndex * duration,
        data: data.subarray(i + 7 + protectionSkipBytes, i + frameLength),
      });

      i += frameLength;
    }

    return {
      skip,
      remaining: i >= len ? undefined : data.subarray(i),
      frames,
      samplingFrequencyIndex,
      sampleRate,
      objectType,
      channelCount,
      codec: `mp4a.40.${objectType}`,
    };
  }

  static getFrameDuration(rate: number): number {
    return 92160000 / rate;
  }
}
