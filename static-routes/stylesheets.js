const sass = require('node-sass');
const config = require('../config');

const development = config.env === 'development';

module.exports = {
  "/stylesheets/main.css": function (callback) {
    const opts = {
      file:               require.resolve("../stylesheets/main.scss"),
      outFile:            '/stylesheets/main.css',

      sourceMap:          development,
      sourceMapEmbed:     development,
      sourceMapContents:  development,
      sourceComments:     development,
      outputStyle:        development ? 'nested' : 'compressed'
    };

    sass.render(opts, (err, result)=> {
      console.log("RENDERED");
      if (err) {
        return callback(err)
      }
      callback(null, result.css);
    });
  }
};