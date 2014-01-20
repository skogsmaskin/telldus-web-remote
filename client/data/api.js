var Client = require("./util/rest-client");

var client = new Client({baseUrl: "/api", adapter: require("./util/xhr-adapter")});

var debounce = require("lodash.debounce")

client.dim = debounce(function(deviceId, level, cb) {
  this.post("/devices/"+deviceId+"/command", {name: 'dim', value: level}, cb)
}, 200);

client.togglePower = debounce(function(deviceId, turnOn, cb) {
  client.post("/devices/"+deviceId+"/command", {name: turnOn ? 'turnOn' : 'turnOff'}, cb)
}, 200);

module.exports = client;