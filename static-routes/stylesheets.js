import sass from 'node-sass'
import bourbon from 'bourbon'
import config from '../config'

const development = config.env === 'development'

module.exports = {
  '/stylesheets/main.css'(callback) {
    const opts = {
      file: require.resolve('../stylesheets/main.scss'),
      includePaths: bourbon.includePaths,
      sourceMap: development,
      sourceMapEmbed: development,
      sourceMapContents: development,
      sourceComments: development ? 'map' : false,
      omitSourceMapUrl: true,
      outputStyle: development ? 'nested' : 'compressed'
    }

    sass.render(opts, (err, result) => {
      if (err) {
        return callback(err)
      }
      callback(null, `${result.css}${
        result.map ? `\n/*# sourceMappingURL=data:application/json;base64,${toBase64(result.map)}*/` : ''
      }`)
    })
  }
}
function toBase64(str) {
  return new Buffer(str).toString('base64')
}