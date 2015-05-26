// (c) 2015 Mapzen
//
// MAPZEN UI BUNDLE
//
// Requires everything via browserify
// ----------------------------------------------------------------------------
/* global require, module */
'use strict'

var bug = require('./bug/bug')
var citysearch = require('./citysearch/citysearch')
var geolocator = require('./geolocator/geolocator')
var zoomcontrol = require('./zoomcontrol')
var iframedAnchors = require('./utils/iframe.anchors.js')

// Export
module.exports = (function () {
  var MPZN = {
    bug: bug,
    citysearch: citysearch,
    geolocator: geolocator,
    zoomcontrol: zoomcontrol,
    Utils: {
      iframedAnchors: iframedAnchors
    }
  }

  // Expose for external access
  window.MPZN = MPZN

  return MPZN
})()
