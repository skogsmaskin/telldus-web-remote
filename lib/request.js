import xhr from "xhr";
import Url from "url";
import qs from "qs";
import "isomorphic-fetch";
import Headers from "./util/headers";

const DEFAULT_HEADERS = new Headers({
  Accept: "application/json,text/plain,* / *"
});

module.exports = function request(url, options={}) {
  const headers = DEFAULT_HEADERS.merge(options.headers);

  const parsedUrl = Url.parse(url, true, true) ;

  if (options.queryString) {
    parsedUrl.search = qs.stringify(Object.assign({}, parsedUrl.query, options.queryString));
  }

  const requestOpts = {
    method: options.method || 'get'
  };

  if (options.body) {
    headers.set("content-type", 'application/json;charset=utf8')
    requestOpts.body = JSON.stringify(options.body);
  }

  requestOpts.headers = headers.asObject();
  return fetch(Url.format(parsedUrl), requestOpts)

};