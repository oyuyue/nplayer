// eslint-disable-next-line import/no-extraneous-dependencies
import React, {
  useEffect,
  useRef,
  memo,
// eslint-disable-next-line import/no-extraneous-dependencies
} from 'react';
import { Player, PlayerOptions } from 'nplayer';

export type NPlayerProps = {
  options?: PlayerOptions;
  style?: Partial<CSSStyleDeclaration>;
  className?: string;
  [key: string]: any;
}

export const NPlayer = React.forwardRef<Player, NPlayerProps>(
  (props = {}, ref) => {
    const divRef = useRef<HTMLDivElement>();
    const playerRef = useRef<Player>();
    const { options, ...rest } = props;

    useEffect(() => {
      if (!divRef.current || typeof document === 'undefined') return;
      if (!playerRef.current) {
        playerRef.current = new Player.Player(options);
      }

      playerRef.current.mount(divRef.current);

      if (typeof ref === 'function') {
        if (playerRef.current) ref(playerRef.current);
      } else if (ref) ref.current = playerRef.current;

      return () => {
        if (playerRef.current) playerRef.current.dispose();
      };
    }, [ref]);

    return React.createElement('div', { ...rest, style: { width: '100%', height: '100%', ...rest.style }, ref: divRef });
  },
);

NPlayer.displayName = 'NPlayer';

export default memo(NPlayer);
