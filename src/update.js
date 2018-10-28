const updateResource = require('./updateResource')
const Competition = require('./models/Competition')

module.exports = ({ competitions }) => updateResource(Competition, competitions)
