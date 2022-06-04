import React from 'react';
import { Player, PlayerOptions } from 'nplayer';
export declare type NPlayerProps = {
    options?: PlayerOptions;
    style?: Partial<CSSStyleDeclaration>;
    className?: string;
    [key: string]: any;
};
export declare const NPlayer: React.ForwardRefExoticComponent<Pick<NPlayerProps, keyof NPlayerProps> & React.RefAttributes<Player>>;
declare const _default: React.MemoExoticComponent<React.ForwardRefExoticComponent<Pick<NPlayerProps, keyof NPlayerProps> & React.RefAttributes<Player>>>;
export default _default;
