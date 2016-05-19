// (c) 2015-2016 Mapzen
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

// To avoid making an external request for styles (which results in an ugly
// Flash of Unstyled Content) we're going to inline all the styles into
// this JS file. This is done by taking the minified, concatenated CSS and
// inserting it via mustache in this variable here:
var css = '{{{ cssText }}}'

// Loads stylesheet for the bug.
// Ensures that it is placed before other defined stylesheets or style
// blocks in the head, so that custom styles are allowed to override
function insertStylesheet (cssText) {
  var firstStylesheet = document.head.querySelectorAll('link, style')[0]
  var styleEl = document.createElement('style')

  styleEl.type = 'text/css'

  if (styleEl.styleSheet){
    styleEl.styleSheet.cssText = css
  } else {
    styleEl.appendChild(document.createTextNode(css))
  }

  if (firstStylesheet !== 'undefined') {
    document.head.insertBefore(styleEl, firstStylesheet)
  } else {
    document.head.appendChild(styleEl)
  }
}

insertStylesheet(css)

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
    if (leafletMap && bug.el && bug.el instanceof HTMLElement) {
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
