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
var zoomcontrol = require('./components/zoomcontrol')
var iframedAnchors = require('./components/utils/iframe.anchors.js')

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

  // Do stuff
  MPZN.zoomcontrol()
  MPZN.Utils.iframedAnchors()

  // Expose for external access
  window.MPZN = MPZN

  return MPZN
})()
