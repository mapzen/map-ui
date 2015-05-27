// (c) 2015 Mapzen
//
// UTILS · IFRAMED ANCHOR TARGETS
//
// Bottom line is, don’t use target="_blank" in anchors.
// Read more: https://css-tricks.com/use-target_blank/
//
// If you’re in an iframe, though, you may not want links to open within the
// frame. The following code snippet will add target="_top" to all links that
// do not have an explicit target attribute. You may force target="_blank" to
// be target="_top" by passing an optional parameter of "true".
//
// Recommended use: run this function in a check for iframed status, e.g.
//     if (window.self !== window.top) anchorTargets(true)
//
// If this is being run with Leaflet, run this after the map is initialized
// to make sure all attribution links open in the parent tab / window.
// ----------------------------------------------------------------------------
module.exports = function (force) {
  'use strict'

  var anchors = document.querySelectorAll('a')

  for (var i = 0, j = anchors.length; i < j; i++) {
    var el = anchors[i]

    // Only set target when not explicitly specified
    // to avoid overwriting intentional targeting behavior
    // Unless the force parameter is true, then targets of
    // '_blank' are forced to to be '_top'
    if (!el.target || (force === true && el.target === '_blank')) {
      el.target = '_top'
    }
  }
}
