var Client = require("./util/rest-client");

var client = new Client({baseUrl: "/api", adapter: require("./util/xhr-adapter")});

client.dim = function(deviceId, level, cb) {
  this.post("/devices/"+deviceId+"/command", {name: 'dim', value: level}, cb)
};

client.togglePower = function(deviceId, turnOn, cb) {
  client.post("/devices/"+deviceId+"/command", {name: turnOn ? 'turnOn' : 'turnOff'}, cb)
};

module.exports = client;