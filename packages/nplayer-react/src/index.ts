import React, {
  useEffect,
  useRef,
  memo,
} from 'react';
import type { Player, PlayerOptions } from 'nplayer';

export type NPlayerProps = {
  options?: PlayerOptions;
  Player?: typeof Player;
  style?: Partial<CSSStyleDeclaration>;
  className?: string;
  [key: string]: any;
}

export const NPlayer = React.forwardRef<Player, NPlayerProps>(
  (props = {}, ref) => {
    const divRef = useRef<HTMLDivElement>();
    const playerRef = useRef<Player>();
    const { Player: PlayerCtor, options, ...rest } = props;

    useEffect(() => {
      if (!divRef.current) return;
      const NP: typeof Player = PlayerCtor || (window as any).NPlayer?.Player;
      if (!NP) throw new Error('[NPlayer] required Player options');

      if (!playerRef.current) {
        playerRef.current = new NP(options);
      }

      playerRef.current.mount(divRef.current);

      if (typeof ref === 'function') {
        if (playerRef.current) ref(playerRef.current);
      } else if (ref && playerRef.current) ref.current = playerRef.current;

      return () => {
        if (playerRef.current) playerRef.current.dispose();
      };
    }, [ref]);

    return React.createElement('div', { ...rest, style: { width: '100%', height: '100%', ...rest.style }, ref: divRef });
  },
);

NPlayer.displayName = 'NPlayer';

export default memo(NPlayer);
