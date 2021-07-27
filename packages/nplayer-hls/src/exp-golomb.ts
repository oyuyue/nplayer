export class ExpGolomb {
  private bytesAvailable: number;

  private bitsAvailable = 0;

  private word = 0;

  constructor(private readonly data: Uint8Array) {
    this.bytesAvailable = data.byteLength;
    if (this.bytesAvailable) this.loadWord();
  }

  private loadWord(): void {
    const position = this.data.byteLength - this.bytesAvailable;
    const availableBytes = Math.min(4, this.bytesAvailable);
    if (availableBytes === 0) throw new Error('no bytes available');

    const workingBytes = new Uint8Array(4);
    workingBytes.set(this.data.subarray(position, position + availableBytes));

    this.word = new DataView(workingBytes.buffer).getUint32(0);
    this.bitsAvailable = availableBytes * 8;
    this.bytesAvailable -= availableBytes;
  }

  skipBits(count: number): void {
    if (this.bitsAvailable > count) {
      this.word <<= count;
      this.bitsAvailable -= count;
    } else {
      count -= this.bitsAvailable;
      const skipBytes = Math.floor(count / 8);
      count -= (skipBytes * 8);
      this.bytesAvailable -= skipBytes;
      this.loadWord();
      this.word <<= count;
      this.bitsAvailable -= count;
    }
  }

  readBits(size: number): number {
    let bits = Math.min(this.bitsAvailable, size);
    const val = this.word >>> (32 - bits);

    this.bitsAvailable -= bits;
    if (this.bitsAvailable > 0) {
      this.word <<= bits;
    } else if (this.bytesAvailable > 0) {
      this.loadWord();
    }

    bits = size - bits;
    if (bits > 0 && this.bitsAvailable) {
      return (val << bits) | this.readBits(bits);
    }
    return val;
  }

  skipLZ(): number {
    let leadingZeroCount;
    for (
      leadingZeroCount = 0;
      leadingZeroCount < this.bitsAvailable;
      ++leadingZeroCount
    ) {
      if ((this.word & (0x80000000 >>> leadingZeroCount)) !== 0) {
        this.word <<= leadingZeroCount;
        this.bitsAvailable -= leadingZeroCount;
        return leadingZeroCount;
      }
    }
    this.loadWord();
    return leadingZeroCount + this.skipLZ();
  }

  skipUEG(): void {
    this.skipBits(1 + this.skipLZ());
  }

  skipEG(): void {
    this.skipBits(1 + this.skipLZ());
  }

  readUEG(): number {
    const clz = this.skipLZ();
    return this.readBits(clz + 1) - 1;
  }

  readEG(): number {
    const val = this.readUEG();
    if (1 & val) {
      return (1 + val) >>> 1;
    }
    return -1 * (val >>> 1);
  }

  readBool(): boolean {
    return this.readBits(1) === 1;
  }

  readUByte(): number {
    return this.readBits(8);
  }

  skipScalingList(count: number): void {
    let lastScale = 8;
    let nextScale = 8;
    let deltaScale;
    for (let j = 0; j < count; j++) {
      if (nextScale !== 0) {
        deltaScale = this.readEG();
        nextScale = (lastScale + deltaScale + 256) % 256;
      }
      lastScale = nextScale === 0 ? lastScale : nextScale;
    }
  }
}
