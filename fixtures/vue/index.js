window.onload = function () {
  Vue.use(NPlayerVue)

  new Vue({
    el: '#app',
    template: `<NPlayer :options="{src: 'https://v-cdn.zjol.com.cn/280443.mp4'}" />`
  })
}
