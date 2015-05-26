bug
===

We make demo pages that are [meant to be iframed into other pages](https://tangrams.github.io/tangram/#mapzen,40.70532700869127,-74.0097749233246,16). [Sometimes](http://tangrams.github.io/tangram-docs-assets/?procedural/tronish.yaml#16/40.7053/-74.0098) they [go viral](http://www.citylab.com/design/2015/03/a-mesmerizing-futuristic-map-with-animated-traffic-and-glowing-buildings/388285/). We need a way to link viewers back to Mapzen so they can learn more about us.

The term "bug" is borrowed from broadcast television (officially, ["digital on-screen graphic"](http://en.wikipedia.org/wiki/Digital_on-screen_graphic)) where a show is branded in the lower corner to identify the broadcast network. The other meaning of "bug" in computing might make this not a great term to use in the long run.

![screenshot](https://cloud.githubusercontent.com/assets/2553268/7524364/87423646-f4cf-11e4-897f-df25b01ec905.png)

The bug component is designed for the following functionality:

1. __Branding:__ Show the Mapzen attribution and provide a link to our website.
2. __Sharing:__ Provide UI for viewers to easily share via social networks.
3. __Tracking:__ Tracks interactions through Google Analytics.

This is as a standalone, drop-in JavaScript "library". It has no hard dependencies (jQuery is not required) and should work on all modern browsers and IE9+ at minimum, although in practice, the demos will be driving the minimum compatibility of the page.

## Including the bug component

Insert the script into your demo's HTML markup:

```html
<!-- Mapzen bug UI component -->
<script src='//s3.amazonaws.com/assets-staging.mapzen.com/ui/components/bug/bug.min.js'></script>
```

Instantiate the bug component in JavaScript:

```js
MapzenBug();
```

You could also assign it to a variable for later use programatically:

```js
var mzBug = new MapzenBug();
```

The bug component works without any additional configuration, but you can customize its behavior with by passing in an object like so:

```js
var mzBug = new MapzenBug({
  name: 'Tangram',
  link: 'https://mapzen.com/projects/',
  tweet: 'Wow, what a cool WebGL map renderer by @mapzen!',
  repo: 'https://github.com/tangrams/tangram/'
});
```

### Basic options

These are optional. Defaults will be provided if not set.

key       | default value         | description
----------|-----------------------|-------------
__link__  | 'https://mapzen.com/' | _String._ URL to go to when viewer clicks on the Mapzen logo. This should be a valid absolute URL.
__name__  | 'Mapzen demo'         | _String._ Name of the demo or product. This will be used in analytics tracking and pre-populating tweets.
__tweet__ | (depends)             | _String._ Set a custom pre-written tweet message. The current URL of the page will be automatically appended to the end of the message. If not included, a default tweet (based on the _name_ option, if provided) will be used. ([see below](#twitter))
__repo__  | 'https://github.com/mapzen/' | _String._ URL to source code repository. This should be a valid absolute URL. The logo is the GitHub logo but it won't magically prepend the GitHub domain for you.


### Advanced options

key           | default value         | description
--------------|-----------------------|-------------
__analytics__ | true                  | _Boolean._ Whether to send custom tracking events to Google Analytics for this demo. Set to false to prevent this demo from sending events or loading Google Analytics (if not already present). If Google Analytics is loaded separately, it behaves normally (as if the bug is not there).

## Features

### Automatic iframe detection

The bug component detects if the page being viewed is in an iframe or not. If it is in an iframe, it naively assumes that its parent page is giving the demo proper context, so its script stops executing immediately and does nothing else.

### Google Analytics event tracking

If Google Analytics is detected on the page, the bug will send [custom tracking events](https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide) to it.

If Google Analytics is not detected on the page, the bug will insert Google Analytics, reporting to the Mapzen website's analytics property.

You can use the options property `analytics: false` to disable event tracking or loading a fallback Analytics.

The following events are currently tracked:

- The bug is active (that is, the viewer has opened this page outside of an iframe)
- If the bug is loading its own Analytics property
- The viewer has clicked the Mapzen logo (which opens the Mapzen website or the URL provided in the `link` option)
- The viewer has clicked the Twitter icon
- The viewer has clicked the Facebook icon

### Custom styling

The bug component loads an external stylesheet. Elements created by the bug have class names attached (prefixed in the `.mz-bug-*` namespace), so you can override the preset styles if you wish. However, this is generally discouraged since we can't guarantee that class names or styles will be backwards-compatible forever.

### Social network sharing

Currently, sharing functionality is borrowed from [RRSSB](https://github.com/kni-labs/rrssb), the library used to create the social sharing buttons used on the Mapzen [blog](https://mapzen.com/blog/).

#### Twitter

You may specify what the pre-filled tweet message is with the `tweet` option. If you don't set it, the default values are:

- If the `name` option is set, the pre-filled tweet is "_name_, powered by @mapzen"
- If the `name` option is _not_ set, the pre-filled tweet is "Check out this demo by @mapzen!"

Tweets automatically include the viewer's current URL (including hash data), so there is no need to provide this yourself.

#### Facebook

Facebook sharing is currently done via "[sharer.php](http://www.joshuawinn.com/facebooks-sharer-php-longer-deprecated-2014/)" which is actually their legacy endpoint for sharing things. (Normally, they would require an app id, which is difficult to set up for each individual demo.) Unfortunately, it's not very "smart." So there is no pre-populated Facebook sharing message, for example.

It *will* automatically link to the viewer's current URL (including hash data).

If you want to customize the image, title, and description that appears in the Facebook post, you will need to add OpenGraph `meta` tags into the `head` of your demo page. [Read the Facebook documentation for more information.](https://developers.facebook.com/docs/sharing/best-practices#tags)

#### Other sharing options

Other sharing options are not currently planned, but may be added in the future.
