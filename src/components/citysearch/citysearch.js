// (c) 2015 Mapzen
//
// MAP UI · CITY SEARCH
//
// ----------------------------------------------------------------------------
/* global jQuery, select2 */

var $ = require('jquery')
var select2 = require('select2')

var citysearch = (function (options) {

  'use strict'

  // Globals
  var opts
  var SELECT2_STYLESHEET = 'https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.1/css/select2.min.css'
  var STYLESHEET = 'https://mapzen.com/common/ui/components/citysearch/citysearch.min.css'
  var CITY_DATA_URL = 'https://mapzen.com/common/ui/components/citysearch/cities.json'
  var CITY_DATA

  var CITY_SELECT_PLACEHOLDER_TEXT = 'Search for city'


  var citysearch = function (options) {

    console.log('citysearch options:', options);
    // nifty JS constructor pattern via browserify documentation
    // https://github.com/substack/browserify-handbook#reusable-components
    if (!(this instanceof citysearch)) return new citysearch(options)

    // If iframed and citysearch isn't explicitly activated, exit & do nothing.
    if (window.self !== window.top && options !== true) {
      return false
    }

    // If citysearch turned off in options, exit & do nothing.
    if (options === false) {
      return false
    }


    function _loadExternalStylesheet (stylesheetUrl) {
      var el = document.createElement('link')
      el.setAttribute('rel', 'stylesheet')
      el.setAttribute('type', 'text/css')
      el.setAttribute('href', stylesheetUrl)
      document.head.appendChild(el)
    }

    function _createElsAndAppend () {
      // Create city locator
      var el = document.createElement('div')
      var selectEl = document.createElement('select')
      var optionEl = document.createElement('option')
      var optionText = document.createTextNode(CITY_SELECT_PLACEHOLDER_TEXT)

      optionEl.setAttribute('disabled', '')
      optionEl.setAttribute('selected', '')
      optionEl.appendChild(optionText)

      selectEl.className = 'js--mz-citysearch-select2'
      selectEl.appendChild(optionEl)

      el.id = 'mz-citysearch'
      el.className = 'mz-citysearch'
      el.appendChild(selectEl)

      document.body.appendChild(el)
      return el
    }

    function _adjustLeafletUI() {
      var el = document.createElement('style')
      var css = '.leaflet-top.leaflet-left { top: 72px; }'
      el.type = 'text/css'
      el.appendChild(document.createTextNode(css))
      document.head.appendChild(el)
    }

    _loadExternalStylesheet(SELECT2_STYLESHEET)
    _loadExternalStylesheet(STYLESHEET)
    var el = _createElsAndAppend()
    _adjustLeafletUI()

    $.get(CITY_DATA_URL, function (data) {
      // Process data
      CITY_DATA = data.map(function (item) {
        return {
          name: item.n,
          lat: item.l.split('/')[0],
          lng: item.l.split('/')[1],
          zoom: item.z
        }
      })

      $(document).ready(function () {
        var $select = $('.js--mz-citysearch-select2');
        CITY_DATA.forEach(function (item) {
          $select.append('<option value="' + item.name + '" data-lat="' + item.lat + '" data-lng="' + item.lng + '" data-zoom="' + item.zoom + '">' + item.name + '</option>')
        })

        $select.select2({
          placeholder: 'Search'
        })

        // Add a class to set it to the expanded state
        $select.on('select2:opening', function (e) {
          el.classList.add('js--mz-citysearch-expanded')
        })

        $select.on('select2:close', function (e) {
          el.classList.remove('js--mz-citysearch-expanded')
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
          var zoom = (el.dataset.zoom === 'undefined') ? null : el.dataset.zoom
          if (zoom) {
            map.setView([lat, lng], zoom)
          } else {
            map.setView([lat, lng])
          }
        })
      })
    })


    this.setOptions(options)

  }

  citysearch.prototype.setOptions = function (options) {
    // Default options
    opts = opts || {
      analytics: true,
      name: null,
      stylesheet: STYLESHEET
    }

    // Copy options values
    if (typeof options === 'object') {
      for (var i in options) {
        opts[i] = options[i]
      }
    }

    this.opts = opts
  }

  return citysearch;
}())
module.exports = citysearch;