export default class Cache {
  constructor() {
    this._cache = Object.create(null)
    this._interval = null
  }
  get(key) {
    if (!this.has(key)) {
      return
    }
    return this._cache[key].value
  }
  set(key, value, expire = Infinity) {
    this._start()
    this._cache[key] = {
      value: value,
      expires: (expire instanceof Date) ? expire : new Date().getTime() + expire
    }
  }
  has(key) {
    return this._has(key) && !this._isExpired(key)
  }

  delete(key) {
    return this._expire(key)
  }

  getAllKeys() {
    return Object.keys(this._cache).filter(key => !this._isExpired(key))
  }

  getAllValues() {
    return this.getAllKeys().map(key => this.get(key))
  }

  _has(key) {
    return (key in this._cache)
  }

  _isExpired(key) {
    const entry = this._cache[key]
    return entry.expires <= new Date().getTime()
  }
  _expire(key) {
    delete this._cache[key]
    if (Object.keys(this._cache).length === 0) {
      this._stop()
    }
  }
  _cleanup() {
    Object.keys(this._cache).map(key => {
      if (this._isExpired(key)) {
        this.expire(key)
      }
    })
  }
  _start() {
    if (this._interval) {
      return
    }
    this._interval = setInterval(this._cleanup.bind(this), 1000 * 60 * 2)
  }
  _stop() {
    clearInterval(this._interval)
    this._interval = null
  }
}
