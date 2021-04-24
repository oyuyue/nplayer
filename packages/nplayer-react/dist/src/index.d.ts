import React from 'react';
import type { Player, PlayerOptions } from 'nplayer';
export declare type NPlayerProps = {
    options?: PlayerOptions;
    Player?: typeof Player;
    style?: Partial<CSSStyleDeclaration>;
    className?: string;
    [key: string]: any;
};
export declare const NPlayer: React.ForwardRefExoticComponent<Pick<NPlayerProps, React.ReactText> & React.RefAttributes<Player>>;
declare const _default: React.MemoExoticComponent<React.ForwardRefExoticComponent<Pick<NPlayerProps, React.ReactText> & React.RefAttributes<Player>>>;
export default _default;
