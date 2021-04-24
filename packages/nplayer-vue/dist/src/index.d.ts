import type { Player } from 'nplayer';
export interface NPlayerVueOptions {
    Player?: typeof Player;
    name?: string;
}
declare const plugin: {
    install(app: any, opts?: NPlayerVueOptions): void;
};
export default plugin;
export { plugin as Plugin };
