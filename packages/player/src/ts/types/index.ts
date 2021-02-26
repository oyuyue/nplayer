export interface PlayerOptions {
  el?: HTMLElement | string;
  video?: HTMLVideoElement;
}

export interface Disposable {
  dispose(): void;
}
