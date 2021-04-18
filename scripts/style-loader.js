const utils = require('loader-utils')

module.exports = function loader() {}
module.exports.pitch = function pitch(request) {
  if (this.cacheable) {
    this.cacheable()
  }

  return `
    var isBrowser = typeof window !== 'undefined' && window.document
    var el;

    function insert() {
      var style = require(${utils.stringifyRequest(this, `!!${request}`)});
      if (style.__esModule) style = style.default
      var css = typeof style === 'string' ? style : style[0][1]
      var create = false
      if (!el) {
        el = document.createElement('style')
        el.setAttribute('type', 'text/css')
        create = true
      }

      if ('textContent' in el) {
        el.textContent = css
      } else {
        el.styleSheet.cssText = css
      }

      if (create) document.head.appendChild(el)
    }

    if (isBrowser) insert()

    if (module.hot && isBrowser) {
      module.hot.accept(${utils.stringifyRequest(this, `!!${request}`)}, function() {
        insert()
      });
      module.hot.dispose(function() {
        if (el) el.parentNode.removeChild(el)
      });
    }
  `
}
