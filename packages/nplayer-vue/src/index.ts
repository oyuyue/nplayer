import { h } from 'vue';
import type { Player } from 'nplayer';

export interface NPlayerVueOptions {
  Player?: typeof Player,
  name?: string;
}

const isVue3 = typeof h === 'function';

const plugin = {
  install(app: any, opts: NPlayerVueOptions = {}) {
    const NPlayerVue = {
      name: opts.name || 'NPlayer',
      props: {
        options: Object,
        set: Function,
      },
      data() {
        return {
          player: null,
        };
      },
      methods: {
        dispose() {
          if ((this as any).player) {
            (this as any).player.dispose();
          }
        },
      },
      mounted() {
        if (typeof document === 'undefined') return;
        const NPlayer: typeof Player = opts.Player || ((window as any).NPlayer?.Player);
        if (!NPlayer) throw new Error('[NPlayer] required Player option');
        if (!this.player) {
          this.player = new NPlayer(this.options);
        }
        this.player.mount(this.$refs.element);
        if (this.set) this.set(this.player);
      },
      [isVue3 ? 'beforeUnmount' : 'beforeDestroy']() { this.dispose(); },
      render(e: any) {
        e = isVue3 ? h : e;
        return e('div', { style: { width: '100%', height: '100%' }, ref: 'element' });
      },
    } as any;

    app.component(NPlayerVue.name, NPlayerVue);
  },
};

export default plugin;

export { plugin as Plugin };
