export function isDefaultColor(color: string) {
  color = color.toLowerCase();
  return color === '#fff' || color === '#ffffff';
}

export const Timer = {
  _prevPauseTime: 0,
  _pausedTime: 0,
  _paused: false,

  now() {
    return ((this._paused ? this._prevPauseTime : Date.now()) - this._pausedTime) / 1000;
  },

  play() {
    if (!this._paused) return;
    this._pausedTime += (Date.now() - this._prevPauseTime);
    this._paused = false;
  },

  pause() {
    if (this._paused) return;
    this._prevPauseTime = Date.now();
    this._paused = true;
  },
};
