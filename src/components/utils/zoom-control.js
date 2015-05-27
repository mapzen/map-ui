// (c) 2015 Mapzen
//
// MAP UI · CONDITIONALLY DISPLAYED ZOOM BUTTONS
//
//                     · A POEM ·
//
// Where there is a map,
// On touch-enabled devices
//
// The zoom controls are unnecessary -
//                They clutter the UI.
//
// Therefore,
// They should be disabled.
//
//                     ·  FIN  ·
//
// Additional notes:
//  - We don’t need to care whether zoom is enabled or not on the map.
//  - It doesn’t matter what the viewport / device dimensions are.
//  - Touch detection is flaky. See this discussion:
//    http://www.stucox.com/blog/you-cant-detect-a-touchscreen/
//    That said, we’ll attempt to capture more frequent
//    use cases and leave zoom buttons in place otherwise.
// ----------------------------------------------------------------------------
/* global Modernizr, map */

var DEBUG = true

function debug (message) {
  if (DEBUG === true) {
    console.log('MPZN ZoomControl: ' + message)
  }
}

module.exports = function () {
  'use strict'

  // Assumes a global `map` object
  // TODO: Ask for object explicitly
  var mapRef = map || null
  var isProbablyTouchscreen

  debug('Conditional zoom control active.')

  // Are we in a touch-screen environment?
  // Check if Modernizr is present and detecting touch
  // Modernizr might be present, but not performing a touch test, so do our own sniff test also
  // TODO: Require Modernizr?
  if ((typeof Modernizr === 'object' && Modernizr.hasOwnProperty('touch') && Modernizr.touch === true) || 'ontouchstart' in window) {
    isProbablyTouchscreen = true
  }

  // Overrides the zoom container element display style
  // TODO: Provide functionality for other map libraries
  if (isProbablyTouchscreen === true) {
    debug('Touchscreen detected.')
    // Double check that it is Leaflet
    if (typeof mapRef === 'object' && mapRef.hasOwnProperty('_leaflet_id')) {
      debug('Leaflet detected, hiding zoom control.')
      mapRef.zoomControl._container.style.display = 'none'
    }
  } else {
    debug('No touchscreen detected, exiting.')
  }
}
