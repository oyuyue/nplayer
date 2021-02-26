import { Component } from 'src/ts/component';
import { Disposable } from 'src/ts/types';

export class DialogItem extends Component {}

export class Dialog implements Disposable {
  dispose(): void {
    throw new Error('Method not implemented.');
  }
}
