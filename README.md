mapzen map scarab
=================

this adds common ui elements for map demos made by mapzen. currently it assumes a globally accessible `map` object that is a Leaflet instance.

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
```

Included components:

- Bug (branding, social sharing, tracking UI)
- Mapzen Search
- Geolocation

### Baseline UI standards

- Zoom in/out buttons, if present, are hidden on touch-enabled devices. See below.
- Links inside of an iframe are asked to open on top of the iframe unless explicitly told otherwise in the anchor `target` attribute.
- URLs should reflect the lat/lng and zoom state of full-screen maps. See `leaflet-hash.js` section below.

## Components

### Bug (separate module)

Branding, social sharing, and tracking UI component for standalone demos. [[separate module](https://github.com/mapzen/ui/tree/master/src/components/bug)]

### Mapzen Search

This installs the [Leaflet geocoder](https://github.com/mapzen/leaflet-geocoder) plugin. By default it is on if the page is not iframed and it is off if the page is iframed.

You can turn it off always by adding this option:

```js
MPZN.bug({
  search: false
});
```

You can turn it on always, even when iframed, by adding this option:

```js
MPZN.bug({
  search: true
});
```

### Locate me

This installs the [Leaflet.Locate](https://github.com/domoritz/leaflet-locatecontrol) plugin. By default it is on if the page is not iframed and it is off if the page is iframed.

You can turn it off always by adding this option:

```js
MPZN.bug({
  locate: false
});
```

You can turn it on always, even when iframed, by adding this option:

```js
MPZN.bug({
  locate: true
});
```

## Building

Install `npm` and dependencies, then:

```
npm install
```

You may also need to install gulp globally:

```
npm install gulp -g
```

Then, each time you want to build everything:

```shell
gulp          # Files are generated in dist/
```

To publish to S3: (env variables containing S3 credentials are expected)

```shell
gulp publish
```
