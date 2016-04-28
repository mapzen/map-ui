mapzen ui
=========

## Map UI

**Work in progress**

Adds map UI components to Mapzen demos. Currently it assumes a globally accessible `map` object that is a Leaflet instance.

Add script to your demo:
```html
<script src='https://mapzen.com/common/ui/mapzen-ui.min.js'></script>
```

Initialize components:
```js
MPZN.bug({
  name: 'Tangram',
  link: 'https://mapzen.com/projects/tangram',
  tweet: 'Tangram: real-time WebGL maps from @mapzen',
  repo: 'https://github.com/tangrams/tangram'
});
MPZN.citysearch();
MPZN.geolocator();
```

Included components:

- Bug (branding, social sharing, tracking UI)
- City search dropdown
- Geolocation

By default, all elements will be hidden if the demo is inside an iframe, and shown otherwise. To force the elements to show inside an iframe:

```js
MPZN.bug({
	bug(true)
});
MPZN.citysearch(true);
MPZN.geolocator(true);
```

And to force an element to be hidden when not in an iframe:

```js
MPZN.bug({
	bug(false)
});
MPZN.citysearch(false);
MPZN.geolocator(false);
```

### Baseline UI standards

- Zoom in/out buttons, if present, are hidden on touch-enabled devices. See below.
- Links inside of an iframe are asked to open on top of the iframe unless explicitly told otherwise in the anchor `target` attribute.
- URLs should reflect the lat/lng and zoom state of full-screen maps. See `leaflet-hash.js` section below.

## Components

### Bug (separate module)

Branding, social sharing, and tracking UI component for standalone demos. [[separate module](https://github.com/mapzen/ui/tree/master/src/components/bug)]

## Building

Install `npm` and dependencies.

To build everything:

```shell
gulp          # Files are generated in dist/
```

To publish to S3: (env variables containing S3 credentials are expected)

```shell
gulp publish
```

## Third party libraries

### leaflet-hash.js

Michael Evan's excellent [leaflet-hash](https://github.com/mlevans/leaflet-hash) library, which addresses point #1 on [Stamen's Checklist for Maps](http://content.stamen.com/stamens-checklist-for-maps), is a core part of map UI for every Mapzen demo. [There is now a public CDN for this library](https://cdnjs.com/libraries/leaflet-hash), and you can also [install as an npm module](https://www.npmjs.com/package/leaflet-hash).

## Live mockups

Demo pages: please check out `gh-pages` branch.
