export interface Item {
    text: string;
    time: number;
    color?: string;
    fontFamily?: string;
    type?: 'top' | 'bottom' | 'scroll';
    isMe?: boolean;
}
export interface DanmakuOptions {
    items?: Item[];
    on?: boolean;
    blockTypes?: ('scroll' | 'top' | 'bottom' | 'color')[];
    opacity?: number;
    area?: number;
    speed?: number;
    fontSize?: number;
    unlimited?: boolean;
    bottomUp?: boolean;
    merge?: boolean;
    baseFontSize?: number;
    staticSeconds?: number;
    colors?: string[];
    type?: number;
    color?: number;
    sendPlaceholder?: string;
    sendHide?: boolean;
    maxLen?: number;
}
export default function processOpts(opts: DanmakuOptions): DanmakuOptions;
//# sourceMappingURL=options.d.ts.map