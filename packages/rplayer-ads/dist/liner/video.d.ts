import Liner from '.';
export default class Video {
    readonly dom: HTMLVideoElement;
    private readonly liner;
    private clickLoad;
    private muted;
    private prevTime;
    constructor(liner: Liner, src?: string, muted?: boolean);
    get playing(): boolean;
    get duration(): number;
    get currentTime(): number;
    get isMuted(): boolean;
    private onClick;
    private onCanPlay;
    private onPlay;
    private onPause;
    private onTimeUpdate;
    private onVolumeChange;
    private onSeeking;
    private onRateChange;
    private onError;
    private onEnded;
    private playVideo;
    play(src?: string): void;
    mute(): void;
    unmute(): void;
    toggleVolume(): void;
    pause(): void;
    show(): void;
    hide(): void;
    destroy(): void;
}
//# sourceMappingURL=video.d.ts.map