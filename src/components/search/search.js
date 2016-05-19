// (c) 2015 Mapzen
//
// MAP UI · MAPZEN SEARCH
//
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

    require('leaflet-geocoder-mapzen')

    var DEMO_API_KEY = 'search-PFZ8iFx'

    var geocoderOptions = {
      expanded: true,
      layers: ['coarse'],
      placeholder: 'Search for city',
      title: 'Search for city',
      pointIcon: false,
      polygonIcon: false,
      markers: false,
      params: {
        sources: 'wof'
      }
    }

    var geocoder = L.control.geocoder(DEMO_API_KEY, geocoderOptions).addTo(map)

    // Re-sort control order so that geocoder is on top
    // geocoder._container is a reference to the geocoder's DOM element.
    geocoder._container.parentNode.insertBefore(geocoder._container, geocoder._container.parentNode.childNodes[0])

    // Handle when viewport is smaller
    window.addEventListener('resize', checkResize)
    checkResize() // Check on load

    var isListening = false
    var previousWidth = getViewportWidth()

    function getViewportWidth () {
      return window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : window.screen.width
    }

    function checkResize (event) {
      var width = getViewportWidth()

      // don't do anything if the WIDTH has not changed.
      if (width === previousWidth) return

      if (width < 900) {
        // Do these checks to make sure collapse / expand events don't fire continuously
        if (L.DomUtil.hasClass(geocoder._container, 'leaflet-pelias-expanded')) {
          geocoder.collapse()
          map.off('mousedown', geocoder.collapse.bind(geocoder))
          isListening = false
        }
      } else {
        if (!L.DomUtil.hasClass(geocoder._container, 'leaflet-pelias-expanded')) {
          geocoder.expand()
          // Make sure only one of these are listening
          if (isListening === false) {
            map.on('mousedown', geocoder.collapse.bind(geocoder))
            isListening = true
          }
        }
      }

      previousWidth = width
    }

    geocoder.on('expand', function (event) {
      if (isListening === false) {
        map.on('mousedown', geocoder.collapse.bind(geocoder))
        isListening = true
      }
    })
  }
}
