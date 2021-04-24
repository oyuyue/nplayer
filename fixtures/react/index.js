window.onload = function () {
  const e = React.createElement

  ReactDOM.render(e(NPlayerReact, { 
    style: { width: '100%', height: '100%' }, 
    className: 'asd', 
    options: { src: 'https://v-cdn.zjol.com.cn/280443.mp4' } }), 
    document.querySelector('#app')
  )
}
