mapzen ui
=========

## Map UI

**Work in progress**

Adds map UI components to Mapzen demos. Currently it assumes a globally accessible `map` object that is a Leaflet instance.

Add script to your demo:
```html
<script src='//s3.amazonaws.com/assets-staging.mapzen.com/ui/mapzen-ui.min.js'></script>
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

Baseline UI standards

- Zoom in/out buttons, if present, are hidden on touch-enabled devices.
- Links inside of an iframe are asked to open on top of the iframe unless explicitly told otherwise in the anchor `target` attribute.


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

## Live mockups

Demo pages: please check out `gh-pages` branch.
