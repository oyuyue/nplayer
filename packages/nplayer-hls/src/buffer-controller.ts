export class BufferController {
  ms?: MediaSource;

  msUrl?: string;

  sourceBufferMap: Record<string, SourceBuffer> = Object.create(null)

  sourceBufferQueue: Record<string, any[]> = {}

  video!: HTMLMediaElement;

  attachMedia(video: HTMLMediaElement) {
    this.ms = new MediaSource();
    this.ms.addEventListener('sourceopen', this.onMediaSourceOpen);
    this.ms.addEventListener('sourceended', this.onMediaSourceEnded);
    this.ms.addEventListener('sourceclose', this.onMediaSourceClose);

    this.msUrl = URL.createObjectURL(this.ms);
    video.src = this.msUrl;
    this.video = video;
  }

  createSourceBuffer(type: string, mimeType: string) {
    if (this.ms && this.ms.readyState === 'open') {
      if (!this.sourceBufferMap[type]) {
        console.log(mimeType);
        console.log(MediaSource.isTypeSupported(mimeType));
        const sb = this.sourceBufferMap[type] = this.ms.addSourceBuffer(mimeType);
        sb.addEventListener('updateend', () => {
          const queue = this.sourceBufferQueue[type];
          if (queue) {
            const buffer = queue.shift();
            if (buffer) sb.appendBuffer(buffer);
          }

          if (this.video.buffered.length) console.log(this.video.buffered.end(this.video.buffered.length - 1));
        });

        sb.addEventListener('error', console.error);
        sb.addEventListener('abort', console.error);
      }
    }
  }

  onMediaSourceOpen = () => {
    this.ms!.removeEventListener('sourceopen', this.onMediaSourceOpen);
  }

  onMediaSourceEnded = () => {}

  onMediaSourceClose = () => {
    console.log('closed');
  }

  append(type: string, buffer: any) {
    const queue = this.sourceBufferQueue[type] = (this.sourceBufferQueue[type] || []);
    queue.push(buffer);

    if (!this.sourceBufferMap[type].updating) {
      const buf = queue.shift();
      if (buf) {
        this.sourceBufferMap[type].appendBuffer(buf);
      }
    }
  }
}
