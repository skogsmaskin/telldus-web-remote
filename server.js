var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });
  return;
}
require("node-jsx").install({extension: '.jsx'})

var express = require('express');
var http = require('http');
var browserify = require('browserify-middleware');
var path = require('path');
var app = express();
var lessMiddleware = require('less-middleware');
var telldus = require('telldus');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

//provide browserified versions of all the files in a app/client
var env = app.get("env");

app.use('/js', browserify('./client', {
  transform: ['reactify'],
  extensions: ['.jsx'],
  debug: env !== 'production',
  minify: env === 'production',
  gzip: env === 'production',
  precompile: ['telldus-webremote.js']
}));

app.use(express.logger(env === 'development' ? 'dev' : 'default'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(lessMiddleware({
  src: __dirname + '/styles',
  dest: __dirname + '/public/css',
  prefix: '/css',
  once: env !== 'development',
  compress: env === 'production',
  sourceMap: env !== 'production'
}));

app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res) {
  var React = require("react")
  var os = require("os");
  var DeviceList = require("./client/elements/device-list");
  telldus.getDevices(function(err, devices) {
    React.renderComponentToString(DeviceList({devices: devices}), function(htmlString) {
      res.render("index", {deviceList: {initialData: devices, html: htmlString}, hostname: os.hostname()})
    })
  })
});

app.get("/api/devices", function(req, res) {
  telldus.getDevices(function(err, devices) {
    res.json(devices || [])
  })
});

function getDeviceById(deviceId, cb) {
  telldus.getDevices(function(err, devices) {
    if (err) return cb(err);
    devices.some(function(device) {
      if (device.id === deviceId) {
        return cb(null, device) || true;
      }
    }) || cb(null, null)
  })
}

var commands = {
  dim: function(deviceId, command, cb) {
    telldus.dim(deviceId, command.value, cb)
  },
  turnOff: function(deviceId, command, cb) {
    telldus.turnOff(deviceId, cb);
  },
  turnOn: function(deviceId, command, cb) {
    telldus.turnOn(deviceId, cb)
  }
}
app.post("/api/devices/:deviceId/command", function(req, res) {
  var deviceId = Number(req.params.deviceId)
  var command = req.body;
  if (!commands.hasOwnProperty(command.name)) {
    res.statusCode = 400;
    res.end("Invalid command "+JSON.stringify(command.name))
  }
  commands[command.name](deviceId, command, function (err) {
    getDeviceById(deviceId, function(err, device) {
      res.json(device)
    });
  })
});

http.globalAgent.maxSockets = Infinity;
return http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
