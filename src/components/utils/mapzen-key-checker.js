// (c) 2017 Mapzen
//
// UTILS · MAPZEN API KEY CHECKER
//
//
//
//
// ----------------------------------------------------------------------------
/* global map */

module.exports = function keyChecker () {
  'use strict'

  var resizeListenerAdded = false

  // Assumes a global `map` and `scene` objects
  var mapRef = window.map || null
  var sceneRef = window.scene || null

  // Bail if neither is present
  if (!mapRef || !sceneRef) return

  // If already loaded
  if (sceneRef.config) {
    if (isMapzenApiKeyMissing(sceneRef.config) === true) showWarning();
  } else {
    sceneRef.subscribe({
      load: function (e) {
        if (isMapzenApiKeyMissing(e.config) === true) showWarning();
      }
    })
  }

  // A basic check to see if an api key string looks like a valid key. Not
  // *is* a valid key, just *looks like* one.
  // TODO: it's possible some legacy keys have 6 digits instead of 7; check with Evan
  function isValidMapzenApiKey(string) {
      return (typeof string === 'string' && string.match(/[-a-z]+-[0-9a-zA-Z_-]{7}/));
  }

  // Adapted from Tangram Play's own automatic API-key insertion code
  function isMapzenApiKeyMissing(config) {
      var keyIsMissing = false;

      // The URL_PATTERN handles the old vector.mapzen.com origin (until it is fully
      // deprecated) as well as the new v1 tile.mapzen.com endpoint.
      // Extensions include both vector and raster tile services.
      var URL_PATTERN = /((https?:)?\/\/(vector|tile).mapzen.com([a-z]|[A-Z]|[0-9]|\/|\{|\}|\.|\||:)+(topojson|geojson|mvt|png|tif|gz))/;

      for (var i = 0, j = Object.keys(config.sources); i < j.length; i++) {
          var source = config.sources[j[i]];
          var valid = false;

          // Check if the source URL is a Mapzen-hosted vector tile service
          if (!source.url.match(URL_PATTERN)) continue;

          // Check if the API key is set on the params object
          if (source.url_params && source.url_params.api_key) {
              var apiKey = source.url_params.api_key;
              var globalApi = config.global.sdk_mapzen_api_key;
              // Check if the global property is valid
              // Tangram.js compatibility note: Tangram <= v0.11.6 fires the `load`
              // event _before_ `global` property substitution, so we theoretically
              // need to resolve all global references for backwards compatitibility.
              // Here, we're only using a check for the global property used by
              // Mapzen basemaps.
              if (apiKey === 'global.sdk_mapzen_api_key' && isValidMapzenApiKey(globalApi)) {
                  valid = true;
              } else if (isValidMapzenApiKey(apiKey)) {
                  valid = true;
              }
          }
          // Check if there is an api_key param in the query string
          else if (source.url.match(/(\?|&)api_key=[-a-z]+-[0-9a-zA-Z_-]{7}/)) {
              valid = true;
          }

          if (!valid) {
              keyIsMissing = true;
              break;
          }
      }

      return keyIsMissing;
  }

  function showWarning() {
    createAndRenderWarningElement()
    positionWarningElements()
    // Prevent this listener from being added more than once.
    if (!resizeListenerAdded) {
      window.addEventListener('optimizedResize', positionWarningElements)
      resizeListenerAdded = true
    }
  }

  function positionWarningElements() {
      var el = document.getElementById('warning')
      el.style.display = 'block'
      var rect = el.getBoundingClientRect()
      var mapEl = document.getElementById('map')
      mapEl.style.height = 'calc(100% - ' + rect.height + 'px)'
      mapEl.style.top = rect.height + 'px'
      var bugEl = document.getElementById('mz-bug')
      if (bugEl) {
          bugEl.style.transform = 'translateY(' + rect.height + 'px)'
      }
  }

  function createAndRenderWarningElement() {
    var el = document.createElement('div')
    el.style.cssText = "display: none; box-sizing: border-box; position: absolute; width: 100%; top: 0; left: 0; padding: 1em; background-color: #ff4947; color: white; font-family: 'Poppins', sans-serif; z-index: 2000; line-height: 1.4;"
    el.innerHTML = "This map uses one or more Mapzen vector tile services without an API key.<strong>Keyless requests will be disabled after March 1, 2017. <a href=\"https://mapzen.com/blog/api-keys-required/\" style=\"white-space: nowrap; color: #1e0e33;\">Learn more.</a></strong>"
    document.body.appendChild(el)
  }

  // Optimized resize throttling - via https://developer.mozilla.org/en-US/docs/Web/Events/resize
  (function() {
      var throttle = function(type, name, obj) {
          obj = obj || window;
          var running = false;
          var func = function() {
              if (running) { return; }
              running = true;
               requestAnimationFrame(function() {
                  obj.dispatchEvent(new CustomEvent(name));
                  running = false;
              });
          };
          obj.addEventListener(type, func);
      };

      /* init - you can init any event */
      throttle("resize", "optimizedResize");
  })();
}
