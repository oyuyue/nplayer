import { Disposable } from 'src/ts/types';
import { Component } from 'src/ts/utils';

export class DialogItem extends Component {}

export class Dialog implements Disposable {
  dispose(): void {
    throw new Error('Method not implemented.');
  }
}
