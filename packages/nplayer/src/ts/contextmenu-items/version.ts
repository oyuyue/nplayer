import { ContextMenuItem } from '../parts/contextmenu';

export const versionContextMenuItem = (): ContextMenuItem => ({
  id: 'version',
  html: `NPlayer v${__VERSION__}`,
  disabled: true,
});
