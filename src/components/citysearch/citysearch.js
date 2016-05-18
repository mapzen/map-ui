// (c) 2015 Mapzen
//
// MAP UI · CITY SEARCH v2
//
// ----------------------------------------------------------------------------
var utils = require('../common/utils')

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

    // Load external stylesheet
    var STYLESHEET = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet-geocoder-mapzen/1.6.0/leaflet-geocoder-mapzen.min.css'
    utils.loadExternalStylesheet(STYLESHEET)

    var DEMO_API_KEY = 'search-MKZrG6M'

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
  }
}
