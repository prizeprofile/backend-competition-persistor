
module.exports = class ParserModule {
  /**
   * Class @constructor.
   *
   * @param {object} competition
   * @param {function} next
   */
  constructor (competition) {
    // Stores the original competition object.
    this._bak = Object.assign({}, competition)

    this.competition = competition
  }

  /**
   * Main logic method.
   *
   * @abstract
   * @return {void}
   */
  async run () { throw new Error('Method run is abstract.') }

  /**
   * Calls next module with the original competition data.
   *
   * @return {void}
   */
  $skip () {
    return this._bak
  }
}
