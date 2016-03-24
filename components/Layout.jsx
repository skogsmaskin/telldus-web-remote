import React, {PropTypes} from'react'
import DOMContentLoadedFix from 'react-domcontentloaded'

export default React.createClass({
  displayName: 'Layout',

  propTypes: {
    title: PropTypes.string,
    serverRenderedProps: PropTypes.object,
    serverRenderedMarkup: PropTypes.string
  },
  getDOMContentLoadedHack() {
    // http://webreflection.blogspot.no/2014/02/the-underestimated-problem-about-script.html
    return {
      __html: (
        '(function(g,a,b,d){function l(m,c){var e={type:d,currentTarget:a,target:a},f=c||m;try{'
        + '"function"===typeof f?f.call(a,e):f.handleEvent(e)}catch(b){g(n,0,b)}}function n(a,c){throw c||a;}'
        + 'function h(){a.removeEventListener(d,h);a[b]=function(b,c,e){b===d?g(l,0,c):k.call(a,b,c,!!e)}}'
        + 'var k=a[b];k.call(a,d,h)})(this.setImmediate||setTimeout,document,"addEventListener","DOMContentLoaded");'
      )
    }
  },
  getServerRenderedMarkup() {
    return {
      __html: this.props.serverRenderedMarkup
    }
  },
  getServerRenderedProps() {
    return {
      __html: `window.__SERVER_RENDERED_PROPS__ = ${JSON.stringify(this.props.serverRenderedProps || {})}`
    }
  },
  render() {
    const {title} = this.props
    return (
      <html>
        <head>
          <DOMContentLoadedFix />
          <meta httpEquiv="Content-Type" content="text/html; charset=utf-8"/>
          <title>{title}</title>
          <script src="/browser.js" async/>
          <link rel="stylesheet" href="/stylesheets/main.css"/>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
        </head>
        <body>
        <div id="root" dangerouslySetInnerHTML={this.getServerRenderedMarkup()}/>
        <script dangerouslySetInnerHTML={this.getServerRenderedProps()}/>
        </body>
      </html>
    )
  }
})
