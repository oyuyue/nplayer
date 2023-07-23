// eslint-disable-next-line import/no-extraneous-dependencies
import { h } from 'vue';
import Player from 'nplayer';

export interface NPlayerVueOptions {
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
      mounted() {
        if (!this.$refs.el || typeof document === 'undefined') return;
        if (!this.player) {
          this.player = new Player.Player(this.options);
        }
        this.player.mount(this.$refs.el);
        if (this.set) this.set(this.player);
      },
      created() {
        this.$watch('options', (newOptions: Object) => {
          this.player.updateOptions(newOptions);
        });
      },
      [isVue3 ? 'beforeUnmount' : 'beforeDestroy']() {
        if ((this as any).player) {
          (this as any).player.dispose();
        }
      },
      render(e: any) {
        e = isVue3 ? h : e;
        return e('div', { style: { width: '100%', height: '100%' }, ref: 'el' });
      },
    } as any;

    app.component(NPlayerVue.name, NPlayerVue);
  },
};

export default plugin;

export { plugin as Plugin };
