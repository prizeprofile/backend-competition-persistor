const populatePromoters = require('./src/promoters')
const saveCompetitions = require('./src/competitions')

exports.handler = async (event, context, callback) => {
  /**
   * A message is stringified object that contains
   * an array of competitions.
   * @type {Object}
   */
  const message = JSON.parse(event.Records.pop().Sns.Message)
  process.env.REGION_ID = message.region_id

  // Saves promoters to database or fetches their id if they're already stored.
  const promoters = await populatePromoters(message.competitions.map(({data}) => data.promoter))

  console.log('breakpoint', 2)

  // Updates competitions array with promoter_id.
  const competitions = message.competitions
    .map((comp) => {
      comp.promoter_id = promoters[comp.data.promoter.twitter_id]

      return comp
    })
    .filter(comp => Number.isInteger(comp.promoter_id))

  // Saves all competitions to the database.
  await saveCompetitions(competitions)

  
  console.log('breakpoint', 4)

  callback(null, 'success')
}
