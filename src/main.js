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
    citysearch: citysearch,
    geolocator: geolocator,
    Utils: {
      anchorTargets: anchorTargets,
      zoomControl: zoomControl,
    }
  }

  MPZN.bug = function (options) {
    Bug(options)

    var leafletMap

    // Is there a window.map thing and is it a Leaflet instance?
    if (window.map && window.map._container && window.map._container instanceof HTMLElement) {
      leafletMap = window.map
    }

    if (options.search !== false) {
      var searchOpts = options.search || {}
      citysearch.init(searchOpts, leafletMap)
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
