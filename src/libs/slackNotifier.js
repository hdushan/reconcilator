/* eslint-disable func-names */
/* eslint-disable no-console */

const SlackWebhook = require('slack-webhook')

function notify(message, testPassed = true) {
  const slack = new SlackWebhook(process.env.SLACK_NOTIFICATION_CHANNEL_WEBHOOK, {
    defaults: {
      username: `Reconcilator: ${process.env.ENV}`,
    },
  })

  slack
    .send({
      text: message,
      icon_emoji: testPassed === true ? ':white_check_mark:' : ':red_circle:',
    })
    .catch(function(err) {
      console.log(err)
    })
}

module.exports = { notify }
