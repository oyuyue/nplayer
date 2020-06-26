export interface Item {
    text: string;
    time: number;
    color?: string;
    fontFamily?: string;
    type?: 'top' | 'bottom' | 'scroll';
    isMe?: boolean;
}
export interface DanmakuOpts {
    items?: Item[];
    area?: number;
    opacity?: number;
    fontSize?: number;
    staticFrame?: number;
    scrollFrame?: number;
    blockTypes?: Item['type'][];
}
export default function processOpts(opts: DanmakuOpts): DanmakuOpts;
//# sourceMappingURL=options.d.ts.map