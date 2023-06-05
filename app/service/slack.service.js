'use strict';

const axios = require('axios');
const conf = require('../../conf/config.json');
const moment = require('moment');

const webhookUrl = conf.slackApi.webhook.url;

async function postToSlack(message) {
  try {
    const res = await axios.post(webhookUrl, {
      text: message,
      mrkdwn: true,
    });
    if (res.status === 200) {
      console.log(
        `✅ [${moment().format(
          'YYYY-MM-DD HH:mm:ss'
        )}]: Slack message posted successfully.`
      );
    } else {
      console.error(
        `❌ [${moment().format(
          'YYYY-MM-DD HH:mm:ss'
        )}]: Error posting to Slack >>`,
        res.statusText
      );
    }
  } catch (error) {
    console.error(
      `❌ [${moment().format(
        'YYYY-MM-DD HH:mm:ss'
      )}]: Error posting to Slack >>`,
      error.message
    );
  }
}

exports.postToSlack = postToSlack;
// Path: app/service/slack.service.js
