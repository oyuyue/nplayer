import {
  addClass,
  addDisposableListener, Component, containClass, toggleClass,
} from 'src/ts/utils';

export interface CheckboxOptions {
  html?: string;
  checked?: boolean;
  change?: (newValue: boolean) => void;
}

const classActive = 'checkbox-active';

export class Checkbox extends Component {
  constructor(container: HTMLElement, opts: CheckboxOptions) {
    super(container, '.checkbox');
    if (opts.html) this.el.innerHTML = opts.html;
    if (opts.change) {
      addDisposableListener(this, this.el, 'click', () => {
        toggleClass(this.el, classActive);
        opts.change!(containClass(this.el, classActive));
      });
    }

    if (opts.checked) addClass(this.el, classActive);
  }

  update(v: boolean) {
    toggleClass(this.el, classActive, v);
  }
}
