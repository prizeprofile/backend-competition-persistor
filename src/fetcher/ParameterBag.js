
module.exports = class ParameterBag {
  /**
   * Returns API method.
   * @return {string}
   */
  get method () {
    return this.data.method || 'search/tweets'
  }

  /**
   * Packs ParameterBag with params.
   *
   * @param {object|string} payload
   * @param {any} [payload=null]
   * @return {ParameterBag}
   */
  pack (payload, value = null) {
    if (! this.data) {
      this.data = {}
    }

    if (value) {
      this.data[payload] = value
    } else {
      for (let property in payload) {
        if (payload.hasOwnProperty(property)) {
          this.data[property] = payload[property]
        }
      }
    }

    return this
  }

  /**
   * Creates a geocode string.
   *
   * @return {string}
   */
  geocode () {
    return this.data.latitude + ',' +
      this.data.longitude + ',' +
      this.data.radius + this.data.units
  }

  /**
   * Converts parameters into Node Twitter SDK friendly format.
   *
   * @return {object}
   */
  twittify () {
    return {
      count: 100,
      lang: this.data.lang,
      tweet_mode: 'extended',
      include_entities: true,
      geocode: this.geocode(),
      since_id: this.data.since_id,
      q: this.data.keywords.join(' OR ')
    }
  }
}
