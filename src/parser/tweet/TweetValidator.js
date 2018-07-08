const _ = require('lodash')
const rules = require('./rules')

module.exports = class TweetValidator {
  /**
   * Runs all rules against given data and transforms it into our standard.
   */
  run (data) {
    // Data has to be valid object in order to perform following operations on it.
    if (!_.isObject(data)) {
      return false
    }

    data = data.retweeted_status || data

    // Runs tests before trying to transform data.
    let prerequisites = this.determinants(data)

    if (!prerequisites) {
      return false
    }

    // Parses the data into our standard.
    let tweet = this.transformers(data)

    // Runs editors and returns Tweet data.
    return tweet ? this.editors(tweet) : false
  }

  /**
   * Evaluates all determinants.
   *
   * @param {object} data
   * @return {boolean}
   */
  determinants (data) {
    return rules.determinants.every((determinant) => {
      let populated = this.populate(determinant.the, data)

      return this.evaluate(determinant.meets, populated)
    })
  }

  /**
   * Transfors all pairs to a new object with correct naming.
   *
   * @param {object} data
   * @return {boolean|object}
   */
  transformers (data) {
    const tweet = {}

    // If any of transformer rules failed, return false.
    // If the data are valid, return a tweet object.
    return rules.transformers.every((transformer) => {
      let from = this.populate(transformer.from, data)

      from = _.isArray(from) ? from : [from]

      // Filters out all invalid fallbacks.
      let value = from.filter((option) => {
        return this.evaluate(transformer.which, option)
      }).shift()

      // If there was no valid fallback and there is no default setting
      // the only way a field can pass is if it's not required.
      if (_.isNil(value) && transformer.default === undefined) {
        return !transformer.required
      }

      // Deep saves the value on property.
      this.deepSave(transformer.to, value || transformer.default, tweet)

      return true
    }) ? tweet : false
  }

  /**
   * Runs all editor functions on data.
   *
   * @param {object} tweet
   * @return {object}
   */
  editors (tweet) {
    // Applies all editor rules.
    rules.editors.forEach((editor) => {
      let runOn = tweet[editor.run]

      if (!runOn) {
        return
      }

      // If runOn is an array, run the through function on all of it's items.
      if (_.isArray(runOn)) {
        tweet[editor.run] = runOn.map(value => editor.through(value))

        return
      }

      tweet[editor.run] = editor.through(runOn)
    })

    return tweet
  }

  /**
   * Deepsaves a property on an object.
   *
   * @param {string} path
   * @param {any} value
   * @param {object} target
   * @return {void}
   */
  deepSave (path, value, target) {
    path.split('.').reduce((tree, node, i, splitPath) => {
      // If this is the last part of the path, only set the value and stop the cycle.
      if (i === splitPath.length - 1) {
        tree[node] = value

        return
      }

      // If the carry already has this property, carry on a pointer to it.
      if (tree[node]) {
        return tree[node]
      }

      // Create a new object on this level.
      tree[node] = {}

      // Carry on a pointer to that object.
      return tree[node]
    }, target)
  }

  /**
   * Populates an object properties.
   *
   * @param {string|any[]} source
   * @param {any} target
   * @return {any}
   */
  populate (source, target) {
    if (_.isString(source)) {
      return this.deepFind(source, target)
    }

    return source.map(path => this.deepFind(path, target))
  }

  /**
   * Deepfinds a property on an object.
   *
   * @param {string} path
   * @param {any} object
   * @return {any}
   */
  deepFind (path, object) {
    return path.split('.').reduce((tree, node) => {
      return tree && tree[node] ? tree[node] : undefined
    }, object)
  }

  /**
   * Evalutes a logical structure of callbacks.
   *
   * @param {Function|Function[]} query
   * @param {any} on
   * @return {boolean}
   */
  evaluate (query, on) {
    // If it's a single function, execute straight away.
    // If it's neither a string nor an array, fail.
    if (_.isFunction(query)) {
      return query(on)
    }

    // eslint-disable-next-line
    let or = false, previous = false, valid = true

    // We have to run each function in a query and execute logical or.
    for (let clause of query) {
      // A string means a logical or.
      if (_.isString(clause)) {
        or = true
        continue
      }

      // Execute the validation clause.
      let curr = clause(on)

      // If current clause is false and we didn't have logical or operator
      // or the previous result was false too, break and return invalid.
      if (!(curr || (or && previous))) {
        valid = false
        break
      }

      previous = curr
      or = false
    }

    return valid
  }
}
