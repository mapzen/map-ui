// (c) 2015 Mapzen
//
// MAP UI · CITY SEARCH v2
//
// ----------------------------------------------------------------------------
module.exports = {
  init: function (options, map) {
    /* global map */
    'use strict'

    // Exit if demo is iframed.
    if (window.self !== window.top) return false

    require('leaflet-geocoder-mapzen')

    var DEMO_API_KEY = 'search-MKZrG6M'
    var STYLESHEET = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet-geocoder-mapzen/1.6.0/leaflet-geocoder-mapzen.min.css'

    var options = {
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

    var geocoder = L.control.geocoder(DEMO_API_KEY, options).addTo(map)

    // Re-sort control order so that geocoder is on top
    // geocoder._container is a reference to the geocoder's DOM element.
    geocoder._container.parentNode.insertBefore(geocoder._container, geocoder._container.parentNode.childNodes[0])

    function _loadExternalStylesheet (stylesheetUrl) {
      var el = document.createElement('link')
      el.setAttribute('rel', 'stylesheet')
      el.setAttribute('type', 'text/css')
      el.setAttribute('href', stylesheetUrl)
      document.head.appendChild(el)
    }

    _loadExternalStylesheet(STYLESHEET)
  }
}
