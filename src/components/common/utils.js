'use strict';

module.exports = {
  loadExternalStylesheet: function (stylesheetUrl) {
    var el = document.createElement('link')
    el.setAttribute('rel', 'stylesheet')
    el.setAttribute('type', 'text/css')
    el.setAttribute('href', stylesheetUrl)
    document.head.appendChild(el)
  }
}
