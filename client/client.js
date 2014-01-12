var slice = [].slice;

module.exports = Client;

var extend = require("util-extend");
var path = require("path");
var url = require("url");

function isObject(val) {
  return typeof val === 'object' && val !== null;
}
function isString(val) {
  return typeof val === 'string'
}

function normalizeArgs(args, method, secondArg) {
  var options = { method: method };
  if (isObject(args[0])) {
    // (options, [cb])
    options = args[0];
  } else {
    // (endpoint, [queryParams|body], [opts], [cb])
    options.endpoint = args[0];
    if (isObject(args[1])) {
      options[secondArg] = args[1];
    }
    if (isObject(args[2])) {
      extend(options, args[2]);
    }
  }
  var cb = args[args.length - 1];
  return typeof cb === 'function' ? [options, cb] : [options];
}
// A Client is a wrapper around a connector and a service, providing an easy way to do various requests to
// service endpoints.
function Client(options) {
  options || (options = {});
  this.baseUrl = options.baseUrl || '';
  this.adapter = options.adapter;
}

Client.prototype.request = function request(options, callback) {
  if (typeof options === 'string') {
    options = { endpoint: options }
  }
  if (!('endpoint' in options)) throw new Error("No endpoint given. Cannot continue.");
  var opts = extend({}, options);
  opts.url = this.urlTo(options.endpoint);
  delete opts.endpoint; // Not needed anymore
  // Delegate the actual request to the adapter
  return this.adapter.apply(this.adapter, [opts].concat(slice.call(arguments, 1)));
};

Client.prototype.urlTo = function urlTo(endpoint, queryString) {
  var u = url.parse(this.baseUrl, !!queryString);
  if (queryString) {
    u.query = u.query ? extend(u.query, queryString) : queryString;
  }
  u.pathname = path.join(u.pathname || '/', endpoint);
  return url.format(u);

  return this.connector.urlTo(this.service.pathTo(endpoint), queryString);
};

Client.prototype.get = function get(endpoint, queryString, opts, cb) {
  return this.request.apply(this, normalizeArgs(arguments, 'get', 'queryString'));
};

Client.prototype.del = function del(endpoint, queryString, opts, cb) {
  return this.request.apply(this, normalizeArgs(arguments, 'delete', 'queryString'));
};

Client.prototype.post = function post(endpoint, body, opts, cb) {
  return this.request.apply(this, normalizeArgs(arguments, 'post', 'body'));
};

Client.prototype.put = function put(endpoint, body, opts, cb) {
  return this.request.apply(this, normalizeArgs(arguments, 'put', 'body'));
};
