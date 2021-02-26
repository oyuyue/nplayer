import { PlayerOptions } from './types';

const defaultOptions: Partial<PlayerOptions> = {};

export function processOptions(opts: PlayerOptions): PlayerOptions {
  return { ...defaultOptions, ...opts };
}
