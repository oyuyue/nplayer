import { addClass, createSvg } from '../utils';

const play = 'M6 2.914v18.172L20.279 12 6 2.914z';
const pause = 'M14.333 20.133H19V3.8h-4.667M5 20.133h4.667V3.8H5v16.333z';
const volume = 'M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z';
const muted = 'M3,9H7L12,4V20L7,15H3V9M16.59,12L14,9.41L15.41,8L18,10.59L20.59,8L22,9.41L19.41,12L22,14.59L20.59,16L18,13.41L15.41,16L14,14.59L16.59,12Z';
const cog = 'M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66z';
const webEnterFullscreen = 'M10,21V19H6.41L10.91,14.5L9.5,13.09L5,17.59V14H3V21H10M14.5,10.91L19,6.41V10H21V3H14V5H17.59L13.09,9.5L14.5,10.91Z';
const webExitFullscreen = 'M19.5,3.09L15,7.59V4H13V11H20V9H16.41L20.91,4.5L19.5,3.09M4,13V15H7.59L3.09,19.5L4.5,20.91L9,16.41V20H11V13H4Z';
const enterFullscreen = 'M3 3h6.429v2.571H5.57V9.43H3V3m11.571 0H21v6.429h-2.571V5.57H14.57V3m3.858 11.571H21V21h-6.429v-2.571h3.858V14.57m-9 3.858V21H3v-6.429h2.571v3.858H9.43z';
const exitFullscreen = 'M14.571 14.571H21v2.572h-3.857V21H14.57v-6.429M3 14.571h6.429V21H6.857v-3.857H3V14.57M6.857 3H9.43v6.429H3V6.857h3.857V3M21 6.857V9.43h-6.429V3h2.572v3.857H21z';
const airplay = 'M6 22h12l-6-6m9-13H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4v-2H3V5h18v12h-4v2h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z';

function createIcon(icon: string) {
  return (cls?: string) => {
    const svg = createSvg('icon', icon);
    if (cls) addClass(svg, cls);
    return svg;
  };
}

const Icon: {
  // eslint-disable-next-line no-use-before-define
  register: typeof registerIcon;
} & {
  [key: string]: <T extends Element>(cls?: string) => T;
} = Object.create(null);

function registerIcon(iconName: string, icon: (cls?: string) => any): void {
  Icon[iconName] = icon;
}

Object.defineProperty(Icon, 'register', { value: registerIcon });

registerIcon('play', createIcon(play));
registerIcon('pause', createIcon(pause));
registerIcon('volume', createIcon(volume));
registerIcon('muted', createIcon(muted));
registerIcon('cog', createIcon(cog));
registerIcon('webEnterFullscreen', createIcon(webEnterFullscreen));
registerIcon('webExitFullscreen', createIcon(webExitFullscreen));
registerIcon('enterFullscreen', createIcon(enterFullscreen));
registerIcon('exitFullscreen', createIcon(exitFullscreen));
registerIcon('airplay', createIcon(airplay));

export { Icon };
