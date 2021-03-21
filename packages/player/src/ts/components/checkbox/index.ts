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
    if (opts.html) this.element.innerHTML = opts.html;
    if (opts.change) {
      addDisposableListener(this, this.element, 'click', () => {
        toggleClass(this.element, classActive);
        opts.change!(containClass(this.element, classActive));
      });
    }

    if (opts.checked) addClass(this.element, classActive);
  }

  update(v: boolean) {
    toggleClass(this.element, classActive, v);
  }
}
