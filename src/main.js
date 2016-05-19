// (c) 2015 Mapzen
//
// MAPZEN UI BUNDLE
//
// Requires everything via browserify
// ----------------------------------------------------------------------------
/* global require, module */
'use strict'

var Bug = require('./components/bug/bug')
var search = require('./components/search/search')
var geolocator = require('./components/geolocator/geolocator')
var zoomControl = require('./components/utils/zoom-control')
var anchorTargets = require('./components/utils/anchor-targets')

var STYLESHEET = '../dist/ui/mapzen-ui.min.css'; //https://mapzen.com/common/ui/mapzen-ui.min.css'

// Loads external stylesheet for the bug.
// Ensures that it is placed before other defined stylesheets or style
// blocks in the head, so that custom styles are allowed to override
function _loadExternalStylesheet (stylesheetUrl) {
  var el = document.createElement('link')
  var firstStylesheet = document.head.querySelectorAll('link, style')[0]

  el.setAttribute('rel', 'stylesheet')
  el.setAttribute('type', 'text/css')
  el.setAttribute('href', stylesheetUrl)

  if (firstStylesheet !== 'undefined') {
    document.head.insertBefore(el, firstStylesheet)
  } else {
    document.head.appendChild(el)
  }
}

_loadExternalStylesheet(STYLESHEET)

// Export
module.exports = (function () {
  var MPZN = {
    // Reference for legacy
    citysearch: search,
    geolocator: geolocator,
    Utils: {
      anchorTargets: anchorTargets,
      zoomControl: zoomControl,
    }
  }

  MPZN.bug = function (options) {
    options = options || {}
    var bug = Bug(options)

    var leafletMap

    // What is the leaflet Map object? You can pass it in as an option, or look for it
    // on window.map and see if it a Leaflet instance
    if (options.map) {
      leafletMap = options.map
    } else if (window.map && window.map._container && window.map._container instanceof HTMLElement) {
      leafletMap = window.map
    }

    // if leaflet, move the bug element into its .leaflet-control-container
    if (leafletMap) {
      leafletMap._container.querySelector('.leaflet-control-container').appendChild(bug.el)
    }

    // Sorted by reverse order
    geolocator.init(options.locate, leafletMap)
    search.init(options.search, leafletMap)
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
