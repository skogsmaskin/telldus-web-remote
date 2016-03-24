import browserify from 'browserify'
import rebundler from 'rebundler'
import SpawnStream from 'spawn-stream'

import config from '../config'
import collapser from 'bundle-collapser/plugin'

import babelify from 'babelify'

const {env} = config

function createBundle(entry) {
  return rebundler({noop: env !== 'development'}, (cache, pkgCache) => {
    return browserify(entry, {
      cache: cache,
      packageCache: pkgCache,
      extensions: ['.jsx'],
      debug: env == 'development',
      fullPaths: env == 'development'
    })
      .transform(babelify)
      .transform('envify', {global: true})
  })
}

const UGLIFY_CMD = require.resolve('uglify-js/bin/uglifyjs')

function uglify() {
  return SpawnStream(UGLIFY_CMD, [
    '--compress',
    '--mangle',
    '--screw-ie8'
  ])
}

const main = createBundle(require.resolve('../browser.js'))

export default {
  '/browser.js'() {
    const b = main()

    if (env !== 'development') {
      b.plugin(collapser)
    }

    const stream = b.bundle()

    if (env !== 'development') {
      return stream.pipe(uglify())
    }

    return stream
  }
}
