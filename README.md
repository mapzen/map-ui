mapzen ui
=========

## Map UI

**Work in progress**

Adds map UI components to Mapzen demos. Currently it assumes a globally accessible `map` object that is a Leaflet instance.

Add script to your demo:
```html
<script src='https://s3.amazonaws.com/assets-staging.mapzen.com/ui/mapzen-ui.min.js'></script>
```

Initialize components:
```js
MPZN.bug({
  name: 'Tangram',
  link: 'https://mapzen.com/projects/tangram',
  tweet: 'Tangram: real-time WebGL maps from @mapzen',
  repo: 'https://github.com/tangrams/tangram'
});
```

Included components:

- Bug (branding, social sharing, tracking UI)
- City search dropdown
- Geolocation

### Baseline UI standards

- Zoom in/out buttons, if present, are hidden on touch-enabled devices. See below.
- Links inside of an iframe are asked to open on top of the iframe unless explicitly told otherwise in the anchor `target` attribute.
- URLs should reflect the lat/lng and zoom state of full-screen maps. See `leaflet-hash.js` section below.

### Detecting a touchscreen

[You can't detect a touchscreen.](http://www.stucox.com/blog/you-cant-detect-a-touchscreen/)

While the edge cases are enough to make it hard to programatically define a clear-cut distinction,  Leaflet does [attempt to detect touch capability](https://github.com/Leaflet/Leaflet/blob/c016634bb1da9006e385f8c38d2d119c8c3cb879/src/core/Browser.js#L27-L28) for its own purposes (similar to [Modernizr's test for touch events](https://github.com/Modernizr/Modernizr/blob/347ddb078116cee91b25b6e897e211b023f9dcb4/feature-detects/touchevents.js)), and so when touch and pointer events are found it adds a `leaflet-touch` class on the map container element. Most of the time, it should be enough for us to defer to Leaflet's touch detection, and use the presence of this class as a hook to attach special touch-enabled interaction logic to, and this ensures that our touch-specific map functionality is tied more closely to whenever Leaflet is also making that decision. To hide zoom buttons on touch devices, then, you can include this CSS:

```css
.leaflet-touch .leaflet-control-zoom {
  display: none;
}
```

Touch detection should be used to enhance or augment an interface for fat fingers. It should not assume anything else: that the user does not have other pointer or input devices attached (they might), or that they are on a mobile device (they might not be), or that the user knows about touch gestures that are not obvious (or discoverable; maybe in a few years we can make different assumptions about this).

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

Michael Evan's excellent [leaflet-hash](https://github.com/mlevans/leaflet-hash) library, which addresses point #1 on [Stamen's Checklist for Maps](http://content.stamen.com/stamens-checklist-for-maps), is a core part of map UI for every Mapzen demo. Currently there does not appear to be a public CDN for this library, so we are serving our own here. Include this URL:

```
https://s3.amazonaws.com/assets-staging.mapzen.com/ui/libraries/leaflet-hash/0.2.1/leaflet-hash.js
```

Without the version number also works if you want to always use the latest version, but this library hasn't been updated in two years (so updates in the near future are unlikely) and there's not an automated way to update this yet anyway.

```
https://s3.amazonaws.com/assets-staging.mapzen.com/ui/libraries/leaflet-hash/leaflet-hash.js
```



## Live mockups

Demo pages: please check out `gh-pages` branch.
