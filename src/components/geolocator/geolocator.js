// (c) 2015 Mapzen
//
// MAP UI · GEOLOCATOR v2
//
// "Locate me" button for demos
// ----------------------------------------------------------------------------
module.exports = {
  init: function (options, map) {
    /* global map */
    'use strict'

    // Handle `options` parameter
    // If `options` is undefined, make it an empty object
    // If `options` is boolean, set options.show property
    // This allows for future syntax where options is an object
    if (options === true) {
      options = {
        show: true
      }
    } else if (options === false) {
      options = {
        show: false
      }
    } else if (typeof options === 'undefined') {
      options = {}
    }

    // Exit if demo is iframed & not forced to be turned on
    if (window.self !== window.top && options.show !== true) return false

    // Exit if forced to be turned off
    if (options.show === false) return false

    require('leaflet.locatecontrol')

    // Geolocator
    var locator = L.control.locate({
      drawCircle: false,
      follow: false,
      showPopup: false,
      markerStyle: {
        opacity: 0,
      },
      strings: {
        title: 'Get current location'
      },
      icon: 'mz-geolocator-icon',
      iconLoading: 'mz-geolocator-icon mz-geolocator-active'
    }).addTo(map)

    // Re-sort control order so that locator is on top
    // locator._container is a reference to the locator's DOM element.
    locator._container.parentNode.insertBefore(locator._container, locator._container.parentNode.childNodes[0])
  }
}
