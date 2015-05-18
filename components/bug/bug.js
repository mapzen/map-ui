// (c) 2015 Mapzen
//
// MAPZEN BUG (or MAPZEN DOG in the UK)
// http://en.wikipedia.org/wiki/Digital_on-screen_graphic
//
// Identifies full-screen demo pages with Mapzen brand and
// provides helpful social media links.
// --------------------------------------------------------
/* global ga */
var MapzenBug = (function () {
  'use strict'

  var protocol = (window.location.protocol === 'https:') ? 'https:' : 'http:'
  var STYLESHEET = protocol + '//s3.amazonaws.com/assets-staging.mapzen.com/ui/components/bug/bug.min.css'
  var DEFAULT_LINK = 'https://mapzen.com/'
  var DEFAULT_GITHUB_LINK = 'https://github.com/mapzen/'
  var TRACKING_CATEGORY = 'demo'

  // Globals
  var opts
    // opts.name      Name of demo
    // opts.link      Link to go to
    // opts.tweet     prewritten tweet
    // opts.analytics track?
    // opts.repo      Link to GitHub repository

  function _track (action, label, value, nonInteraction) {
    if (opts.analytics === false) return false

    if (typeof ga === 'undefined') {
      return false
    }

    ga('send', 'event', TRACKING_CATEGORY, action, label, value, nonInteraction)
  }

  function _loadAnalytics () {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-47035811-1', 'auto');
    ga('send', 'pageview');
  }

  // Loads external stylesheet for the bug.
  // Ensures that it is placed before other defined stylesheets or style
  // blocks in the head, so that custom styles are allowed to override
  function _loadExternalStylesheet (stylesheetUrl) {
    var el = document.createElement('link')
    var firstStylesheet = document.head.querySelectorAll('link, style')[0]

    el.setAttribute('rel', 'stylesheet')
    el.setAttribute('type', 'text/css')
    el.setAttribute('href', stylesheetUrl)

    if (firstStylesheet !== 'undefined') {
      document.head.insertBefore(el, firstStylesheet)
    } else {
      document.head.appendChild(el)
    }
  }

  function _popupWindow (url, title, w, h) {
    // Borrowed from rrssb
    // Fixes dual-screen position                         Most browsers      Firefox
    var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left
    var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top

    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height

    var left = ((width / 2) - (w / 2)) + dualScreenLeft
    var top = ((height / 3) - (h / 3)) + dualScreenTop

    var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left)

    // Puts focus on the newWindow
    if (window.focus) {
      newWindow.focus()
    }
  }

  function _buildTwitterLink () {
    var base = 'https://twitter.com/intent/tweet'
    var url = encodeURIComponent(window.location.href)
    var text
    var params

    if (opts.tweet) {
      text = encodeURIComponent(opts.tweet)
    } else if (opts.name) {
      text = encodeURIComponent(opts.name + ', powered by @mapzen')
    } else {
      text = encodeURIComponent('Check out this project by @mapzen!')
    }

    params = '?text=' + text + '&url=' + url
    return base + params
  }

  function _buildFacebookLink () {
    var base = 'https://www.facebook.com/sharer/sharer.php?u='
    var url = encodeURIComponent(window.location.href)
    return base + url
  }

  function _createElsAndAppend () {
    var mapzenLink = opts.link || DEFAULT_LINK
    var mapzenTitle = (opts.name) ? opts.name + ' · Powered by Mapzen' : 'Powered by Mapzen'
    var githubLink = opts.repo || DEFAULT_GITHUB_LINK
    var el = document.createElement('div')

    // Create container
    el.id = 'mz-bug'
    el.className = 'mz-bug-container'
    el.setAttribute('role', 'widget')

    // Create buttons
    var mapzenEl = _createButtonEl('mapzen', mapzenLink, mapzenTitle, _onClickMapzen)
    var twitterEl = _createButtonEl('twitter', _buildTwitterLink(), 'Share this on Twitter', _onClickTwitter)
    var facebookEl = _createButtonEl('facebook', _buildFacebookLink(), 'Share this on Facebook', _onClickFacebook)
    var githubEl = _createButtonEl('github', githubLink, 'View source on GitHub', _onClickGitHub)

    // Build DOM
    el.appendChild(mapzenEl)
    el.appendChild(twitterEl)
    el.appendChild(facebookEl)
    el.appendChild(githubEl)
    document.body.appendChild(el)

    return el
  }

  function _createButtonEl (id, linkHref, linkTitle, clickHandler) {
    var linkEl = document.createElement('a')
    var logoEl = document.createElement('div')

    logoEl.className = 'mz-bug-' + id + '-logo'
    linkEl.href = linkHref
    linkEl.target = '_blank'
    linkEl.className = 'mz-bug-' + id + '-link'
    linkEl.title = linkTitle
    linkEl.addEventListener('click', clickHandler)

    linkEl.appendChild(logoEl)
    return linkEl
  }

  function _onClickMapzen (event) {
    _track('click', 'mapzen logo', opts.name)
  }

  function _onClickTwitter (event) {
    event.preventDefault()
    var link = _buildTwitterLink()
    _popupWindow(link, 'Twitter', 580, 470)
    _track('click', 'twitter', opts.name)
  }

  function _onClickFacebook (event) {
    event.preventDefault()
    var link = _buildFacebookLink()
    _popupWindow(link, 'Facebook', 580, 470)
    _track('click', 'facebook', opts.name)
  }

  function _onClickGitHub (event) {
    _track('click', 'github', opts.name)
  }

  var MapzenBug = function (options) {
    // If iframed, exit & do nothing.
    if (window.self !== window.top) {
      return false
    }

    opts = options || {}
    opts.analytics = (typeof options.analytics === 'undefined') ? true : options.analytics
    opts.name = options.name || null
    opts.stylesheet = options.stylesheet || STYLESHEET
    this.opts = opts

    _loadExternalStylesheet(this.opts.stylesheet)
    this.el = _createElsAndAppend(this.opts)
    this.twitterEl = this.el.querySelector('.mz-bug-twitter-link')
    this.facebookEl = this.el.querySelector('.mz-bug-facebook-link')

    // Build links
    this.rebuildLinks()

    // Rebuild links if hash changes
    window.onhashchange = function () {
      this.rebuildLinks()
    }.bind(this)

    // Check if Google Analytics is present soon in the future; if not, load it.
    window.setTimeout(function () {
      if (typeof ga === 'undefined') {
        _loadAnalytics()
        _track('analytics', 'fallback', null, true)
      }

      _track('bug', 'active', opts.name, true)
    }, 0)
  }

  MapzenBug.prototype.rebuildLinks = function () {
    this.twitterEl.href = _buildTwitterLink()
    this.facebookEl.href = _buildFacebookLink()
  }

  return MapzenBug
}())
