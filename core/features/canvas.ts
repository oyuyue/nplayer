import type { Player } from "../player";

export class CanvasVideo {

  canvas: HTMLCanvasElement;

  constructor(private player: Player) {
    this.canvas = document.createElement('canvas')
    const ctx = this.canvas.getContext('2d')
  }

}
