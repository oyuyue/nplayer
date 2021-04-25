import Vue from 'vue';
import type { Player } from 'nplayer';

export interface NPlayerVueOptions {
  Player?: typeof Player,
  name?: string;
}

const plugin = {
  install(app: any, opts: NPlayerVueOptions = {}) {
    const NPlayer: typeof Player = opts.Player || ((window as any).NPlayer?.Player);
    if (!NPlayer) throw new Error('[NPlayer] required Player option');

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
          (this as any).player.dispose();
        },
      },
      mounted() {
        if (!this.player) {
          this.player = new NPlayer(this.options);
        }
        this.player.mount(this.$refs.element);
        if (this.set) this.set(this.player);
      },
      beforeDestroy() { this.dispose(); },
      beforeUnmount() { this.dispose(); },
      render(h: any) {
        h = Vue.h || h;
        return h('div', { style: { width: '100%', height: '100%' }, ref: 'element' });
      },
    } as any;

    app.component(NPlayerVue.name, NPlayerVue);
  },
};

export default plugin;

export { plugin as Plugin };
