const AWS = require('aws-sdk')

module.exports = (message) => {
  console.log('message', message)

  return Promise.resolve()
}
