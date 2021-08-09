import { ExpGolomb } from './exp-golomb';

export class AVC {
  static parseAnnexBNALus(data: Uint8Array): { units?: Uint8Array[], remaining?: Uint8Array } {
    const len = data.length;
    let start = 2;
    let end = 0;
    while (data[start] != null && data[start] !== 1) {
      start++;
    }
    start++;
    end = start + 2;

    if (end >= len) return {};

    const units = [];

    while (end < len) {
      switch (data[end]) {
        case 0:
          if (data[end - 1] !== 0) {
            end += 2;
            break;
          } else if (data[end - 2] !== 0) {
            end++;
            break;
          }

          if (start !== end - 2) units.push(data.subarray(start, end - 2));

          do {
            end++;
          } while (data[end] !== 1 && end < len);
          start = end + 1;
          end = start + 2;
          break;
        case 1:
          if (data[end - 1] !== 0 || data[end - 2] !== 0) {
            end += 3;
            break;
          }
          if (start !== end - 2) units.push(data.subarray(start, end - 2));
          start = end + 1;
          end = start + 2;
          break;
        default:
          end += 3;
          break;
      }
    }
    return { units, remaining: start - 3 < len ? data.subarray(start - 3) : undefined };
  }

  static parseSPS(unit: Uint8Array) {
    const eg = new ExpGolomb(unit);
    eg.readUByte();

    const profileIdc = eg.readUByte();
    const profileCompatibility = eg.readUByte();
    const levelIdc = eg.readUByte();
    eg.skipUEG();

    let chromaFormat = 420;
    if (
      profileIdc === 100
      || profileIdc === 110
      || profileIdc === 122
      || profileIdc === 244
      || profileIdc === 44
      || profileIdc === 83
      || profileIdc === 86
      || profileIdc === 118
      || profileIdc === 128
    ) {
      const chromaFormatIdc = eg.readUEG();
      if (chromaFormatIdc <= 3) chromaFormat = [0, 420, 422, 444][chromaFormatIdc];
      if (chromaFormatIdc === 3) eg.skipBits(1);
      eg.skipUEG();
      eg.skipUEG();
      eg.skipBits(1);
      if (eg.readBool()) {
        const scalingListCount = chromaFormatIdc !== 3 ? 8 : 12;
        for (let i = 0; i < scalingListCount; i++) {
          if (eg.readBool()) {
            if (i < 6) {
              eg.skipScalingList(16);
            } else {
              eg.skipScalingList(64);
            }
          }
        }
      }
    }

    eg.skipUEG();
    const picOrderCntType = eg.readUEG();
    if (picOrderCntType === 0) {
      eg.readUEG();
    } else if (picOrderCntType === 1) {
      eg.skipBits(1);
      eg.skipEG();
      eg.skipEG();
      const numRefFramesInPicOrderCntCycle = eg.readUEG();
      for (let i = 0; i < numRefFramesInPicOrderCntCycle; i++) {
        eg.skipEG();
      }
    }

    eg.skipUEG();
    eg.skipBits(1);
    const picWidthInMbsMinus1 = eg.readUEG();
    const picHeightInMapUnitsMinus1 = eg.readUEG();
    const frameMbsOnlyFlag = eg.readBits(1);
    if (frameMbsOnlyFlag === 0) eg.skipBits(1);
    eg.skipBits(1);

    let frameCropLeftOffset = 0;
    let frameCropRightOffset = 0;
    let frameCropTopOffset = 0;
    let frameCropBottomOffset = 0;

    if (eg.readBool()) {
      frameCropLeftOffset = eg.readUEG();
      frameCropRightOffset = eg.readUEG();
      frameCropTopOffset = eg.readUEG();
      frameCropBottomOffset = eg.readUEG();
    }

    let sarRatio: [number, number] = [1, 1];
    let numUnitsInTick;
    let timeScale;
    let fixedFrame;
    if (eg.readBool()) {
      if (eg.readBool()) {
        const aspectRatioIdc = eg.readUByte();
        switch (aspectRatioIdc) {
          case 1: sarRatio = [1, 1]; break;
          case 2: sarRatio = [12, 11]; break;
          case 3: sarRatio = [10, 11]; break;
          case 4: sarRatio = [16, 11]; break;
          case 5: sarRatio = [40, 33]; break;
          case 6: sarRatio = [24, 11]; break;
          case 7: sarRatio = [20, 11]; break;
          case 8: sarRatio = [32, 11]; break;
          case 9: sarRatio = [80, 33]; break;
          case 10: sarRatio = [18, 11]; break;
          case 11: sarRatio = [15, 11]; break;
          case 12: sarRatio = [64, 33]; break;
          case 13: sarRatio = [160, 99]; break;
          case 14: sarRatio = [4, 3]; break;
          case 15: sarRatio = [3, 2]; break;
          case 16: sarRatio = [2, 1]; break;
          case 255: {
            sarRatio = [
              (eg.readUByte() << 8) | eg.readUByte(),
              (eg.readUByte() << 8) | eg.readUByte(),
            ];
            break;
          }
        }
      }

      if (eg.readBool()) eg.readBool();

      if (eg.readBool()) {
        eg.readBits(4);
        if (eg.readBool()) eg.readBits(24);
      }

      if (eg.readBool()) {
        eg.readUEG();
        eg.readUEG();
      }

      if (eg.readBool()) {
        numUnitsInTick = eg.readBits(32);
        timeScale = eg.readBits(32);
        fixedFrame = eg.readBool();
      }
    }

    return {
      profileIdc,
      profileCompatibility,
      levelIdc,
      chromaFormat,
      width: Math.ceil(
        (picWidthInMbsMinus1 + 1) * 16
          - frameCropLeftOffset * 2
          - frameCropRightOffset * 2,
      ),
      height:
        (2 - frameMbsOnlyFlag) * (picHeightInMapUnitsMinus1 + 1) * 16
        - (frameMbsOnlyFlag ? 2 : 4)
          * (frameCropTopOffset + frameCropBottomOffset),
      sarRatio,
      numUnitsInTick,
      timeScale,
      fixedFrame,
    };
  }

  static parseSEI(unit: Uint8Array): { payload: Uint8Array, type: number, size: number, uuid: string } {
    const len = unit.length;
    let i = 1;
    let type = 0;
    let size = 0;
    let uuid = '';

    while (unit[i] === 255) {
      type += 255;
      i++;
    }
    type += unit[i++];

    while (unit[i] === 255) {
      size += 255;
      i++;
    }
    size += unit[i++];

    if (type === 5 && len > i + 16) {
      for (let j = 0; j < 16; j++) {
        uuid += unit[i].toString(16);
        i++;
      }
    }

    return {
      payload: unit.subarray(i), type, size, uuid,
    };
  }

  static removeEPB(uint: Uint8Array): Uint8Array {
    const length = uint.byteLength;
    const emulationPreventionBytesPositions = [];
    let i = 1;

    while (i < length - 2) {
      if (uint[i] === 0 && uint[i + 1] === 0 && uint[i + 2] === 0x03) {
        emulationPreventionBytesPositions.push(i + 2);
        i += 2;
      } else {
        i++;
      }
    }

    if (!emulationPreventionBytesPositions.length) return uint;

    const newLength = length - emulationPreventionBytesPositions.length;
    const newData = new Uint8Array(newLength);

    let sourceIndex = 0;
    for (i = 0; i < newLength; sourceIndex++, i++) {
      if (sourceIndex === emulationPreventionBytesPositions[0]) {
        sourceIndex++;
        emulationPreventionBytesPositions.shift();
      }
      newData[i] = uint[sourceIndex];
    }

    return newData;
  }
}
