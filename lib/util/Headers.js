export default class Headers {
  constructor(headers) {
    this.set(headers);
  }
  removeAll(headers) {
    this._headerNames = {};
    this._headerValues = {};
    return this;
  }
  remove(header) {
    const key = header.toLowerCase();
    delete this._headerNames[key];
    delete this._headerValues[key];
    return this;
  }
  set(name, value) {
    this.removeAll();
    if (typeof name == 'object') {
      return this.merge(name)
    }
    const key = name.toLowerCase();
    this._headerNames[key] = name;
    this._headerValues[key] = value;
    return this;
  }
  merge(headers={}) {
    Object.keys(headers).forEach(name => {
      this.set(name, headers[name]);
    });
    return this;
  }
  asObject() {
    return Object.keys(this._headerNames).reduce((acc, key) => {
      acc[this._headerNames[key]] = this._headerValues[key];
      return acc;
    }, {});
  }
}