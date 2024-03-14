import { Player } from './player'


const player = new Player({
  media: document.createElement('video')
})

player.mount('#c')
