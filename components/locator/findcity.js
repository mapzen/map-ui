// (c) 2015 Mapzen
//
// City dropdown
// --------------------------------------------------------
/* global jQuery, select2 */
(function ($) {
  'use strict'

  // Exit if demo is iframed.
  if (window.self !== window.top) return false

  var STYLESHEET = 'findcity.css'
  var CITY_DATA_URL = '//s3.amazonaws.com/assets-staging.mapzen.com/ui/components/locator/cities.json'
  var CITY_DATA

  function _loadExternalStylesheet () {
    var el = document.createElement('link')
    el.setAttribute('rel', 'stylesheet')
    el.setAttribute('type', 'text/css')
    el.setAttribute('href', STYLESHEET)
    document.head.appendChild(el)
  }

  _loadExternalStylesheet()

  $.get(CITY_DATA_URL, function (data) {
    CITY_DATA = JSON.parse(data)

    // Process data
    CITY_DATA = CITY_DATA.map(function (item) {
      return {
        name: item.n,
        lat: item.l.split('/')[0],
        lng: item.l.split('/')[1],
        zoom: item.z
      }
    })

    // Assume the JSON is sorted already.

    $(document).ready(function () {
      var $select = $('.js-citylocate-select2');
      CITY_DATA.forEach(function (item) {
        $select.append('<option value="' + item.name + '" data-lat="' + item.lat + '" data-lng="' + item.lng + '" data-zoom="' + item.zoom + '">' + item.name + '</option>')
      })

      $select.select2({
        placeholder: 'Search'
      })

      // Input into the search field should not bubble up and
      // interact with other GUIs inserted onto page.
      // Example: dat-gui listens for 'h' key to hide the UI
      $select.on('select2:open', function (e) {
        $('.select2-search__field').on('keydown', function (e) {
          e.stopPropagation()
        })
      })

      $select.on('select2:select', function (e) {
        /* global map */
        var el = e.params.data.element
        var lat = el.dataset.lat
        var lng = el.dataset.lng
        var zoom = (el.dataset.zoom === 'undefined') ? null : el.dataset.zoom;
        if (zoom) {
          map.setView([lat, lng], zoom);
        } else {
          map.setView([lat, lng]);
        }
      })
    });
  })
})(jQuery);
