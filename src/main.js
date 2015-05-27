// (c) 2015 Mapzen
//
// MAPZEN UI BUNDLE
//
// Requires everything via browserify
// ----------------------------------------------------------------------------
/* global require, module */
'use strict'

var bug = require('./components/bug/bug')
var citysearch = require('./components/citysearch/citysearch')
var geolocator = require('./components/geolocator/geolocator')
var zoomControl = require('./components/utils/zoom-control')
var anchorTargets = require('./components/utils/anchor-targets')

// Export
module.exports = (function () {
  var MPZN = {
    bug: bug,
    citysearch: citysearch,
    geolocator: geolocator,
    Utils: {
      anchorTargets: anchorTargets,
      zoomControl: zoomControl,
    }
  }

  // Do stuff
  MPZN.Utils.zoomControl()

  // Only operate if iframed
  if (window.self !== window.top) {
    MPZN.Utils.anchorTargets()
  }

  // Expose for external access
  window.MPZN = MPZN

  return MPZN
})()
