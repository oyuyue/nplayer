export interface Language {
    [key: string]: Record<string, string>;
}
export declare const FULL_SCREEN = "Fullscreen";
export declare const EXIT_FULL_SCREEN = "Exit fullscreen";
export declare const SETTINGS = "Settings";
export declare const PLAY = "Play";
export declare const PAUSE = "Pause";
export declare const MUTE = "Mute";
export declare const UNMUTE = "Unmute";
export declare const NORMAL = "Normal";
export declare const SPEED = "Speed";
export declare const CAPTIONS = "Captions";
export declare const CLOSE = "Close";
declare const language: Language;
export default language;
