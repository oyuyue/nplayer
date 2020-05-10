import RPlayer from './rplayer';
declare class Responsive {
    private readonly player;
    private resizePending;
    constructor(player: RPlayer);
    private mqHandler;
    private resizeHandler;
}
export default Responsive;
