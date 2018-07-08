
module.exports = class Tweet {
  /**
   * Class constructor.
   *
   * @param {TweetValidator} validator
   */
  constructor (validator) {
    this.validator = validator

    this.container = {}
  }

  /**
   * Creates a Tweet from given data.
   *
   * @param {any} data
   * @return {Tweet}
   */
  from (data) {
    let result = this.validator.run(data)

    if (! result || typeof result !== 'object') {
      this.valid = false
    } else {
      this.data = result
    }

    return this
  }

  /**
   * Resolves whether the tweet was valid.
   *
   * @return {boolean}
   */
  isTweet () {
    return this.valid !== false
  }

  /**
   * Binds a value to the container.
   * @param  {string} key
   * @param  {any} value
   * @return {Tweet}
   */
  bind (key, value) {
    this.container[key] = value

    return this
  }

  /**
   * Resolves a value from container.
   * @param  {string} key
   * @return {any}
   */
  resolve (key) {
    return this.container[key]
  }
}
