// (c) 2015 Mapzen
//
// MAPZEN UI BUNDLE
//
// Requires everything via browserify
// ----------------------------------------------------------------------------
/* global require, module */
'use strict'

var Bug = require('./components/bug/bug')
var citysearch = require('./components/citysearch/citysearch')
var geolocator = require('./components/geolocator/geolocator')
var zoomControl = require('./components/utils/zoom-control')
var anchorTargets = require('./components/utils/anchor-targets')

// Export
module.exports = (function () {
  var MPZN = {
    // Reference for legacy
    citysearch: citysearch,
    geolocator: geolocator,
    Utils: {
      anchorTargets: anchorTargets,
      zoomControl: zoomControl,
    }
  }

  MPZN.bug = function (options) {
    options = options || {}
    Bug(options)

    var leafletMap

    // What is the leaflet Map object? You can pass it in as an option, or look for it
    // on window.map and see if it a Leaflet instance
    if (options.map) {
      leafletMap = options.map
    } else if (window.map && window.map._container && window.map._container instanceof HTMLElement) {
      leafletMap = window.map
    }

    // Sorted by reverse order
    geolocator.init(options.locate, leafletMap)
    citysearch.init(options.search, leafletMap)
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
