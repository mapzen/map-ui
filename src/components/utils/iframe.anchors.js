// (c) 2015 Mapzen
//
// UTILS · IFRAMED ANCHORS
//
// Bottom line is, don’t use target="_blank" in anchors.
// Read more: https://css-tricks.com/use-target_blank/
//
// If you’re in an iframe, though, you may not want links to open within the
// frame. The following code snippet will add target="_top" to all links that
// do not have an explicit target attribute, if the page is inside an iframe.
// You should run it after, say, links are created by Leaflet to make sure all
// attribution links open in the parent tab / window.
// ----------------------------------------------------------------------------
module.exports = function () {
  'use strict'

  // Only operate if iframed
  if (window.self !== window.top) {
    var anchors = document.querySelectorAll('a')
    for (var i = 0, j = anchors.length; i < j; i++) {
      var el = anchors[i]
      // Only attach target when not explicitly specified
      // to avoid overwriting intentional targeting behavior
      if (!el.target) {
        el.target = '_top'
      }
    }
  }
}
