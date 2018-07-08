const _ = require('lodash')

module.exports = {
  determinants: [
    {
      the: 'retweeted_status',
      meets: [_.isNil, 'OR', _.isEmpty]
    }
  ],

  transformers: [
    {
      from: ['extended_tweet.full_text', 'full_text', 'text'],
      which: _.isString,
      to: 'tweet.text',
      required: true
    },
    {
      from: 'id_str',
      which: _.isString,
      to: 'tweet.tweet_id',
      required: true
    },
    {
      from: ['user.location', 'place', 'geo', 'coordinates', 'lang', 'user.lang'],
      which: [_.isString, 'OR', _.isNumber],
      to: 'tweet.location'
    },
    {
      from: ['timestamp_ms', 'created_at'],
      which: [_.isString, 'OR', _.isNumber],
      to: 'tweet.posted',
      required: true
    },
    {
      from: 'reply_count',
      which: _.isNumber,
      to: 'tweet.replies'
    },
    {
      from: 'retweet_count',
      which: _.isNumber,
      to: 'tweet.retweets'
    },
    {
      from: 'favorite_count',
      which: _.isNumber,
      to: 'tweet.favorites'
    },
    {
      from: 'user.id_str',
      which: _.isString,
      to: 'promoter.twitter_id',
      required: true
    },
    {
      from: ['user.profile_image_url_https', 'profile_banner_url'],
      which: _.isString,
      to: 'promoter.thumbnail'
    },
    {
      from: 'user.followers_count',
      which: _.isNumber,
      to: 'promoter.followers',
      default: 0
    },
    {
      from: 'user.screen_name',
      which: _.isString,
      to: 'promoter.screen_name',
      required: true
    },
    {
      from: 'user.name',
      which: _.isString,
      to: 'promoter.name'
    },
    {
      from: 'user.verified',
      which: _.isBoolean,
      to: 'promoter.verified',
      default: false
    },
    {
      from: 'user.description',
      which: _.isString,
      to: 'promoter.description'
    }
  ],

  editors: [
    {
      run: 'location',
      through: loc => loc.toString()
    }
  ]
}
