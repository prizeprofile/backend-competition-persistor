const db = require('./src/db')
const populatePromoters = require('./src/promoters')
const saveCompetitions = require('./src/competitions')

exports.handler = async (event, context, callback) => {
  // Don't close the Mysql connection. It's to be reused by next lambda.
  context.callbackWaitsForEmptyEventLoop = false

  /**
   * A message is stringified object that contains
   * an array of competitions.
   * @type {Object}
   */
  const message = JSON.parse(event.Records.pop().Sns.Message)
  process.env.REGION_ID = message.region_id

  // Saves promoters to database or fetches their id if they're already stored.
  const promoters = await populatePromoters(message.competitions.map(({data}) => data.promoter), db)

  // Updates competitions array with promoter_id.
  const competitions = message.competitions
    .map((comp) => {
      comp.promoter_id = promoters[comp.data.promoter.twitter_id]

      return comp
    })
    .filter(comp => Number.isInteger(comp.promoter_id))

  // Saves all competitions to the database.
  await saveCompetitions(competitions, db)

  await Promise.resolve(db.destroy())
    .catch(console.error)
    // TODO: Analytics.
    .then(() => callback(null, 'success'))
}
