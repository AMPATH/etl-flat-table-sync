"use strict";
const axios = require("axios");
const conf = require("../conf/config");

const serviceDef = {
  postChannelMesssage
};

function postChannelMesssage(payload) {
  return new Promise((resolve, reject) => {
    if (payload === "" || payload === null) {
      reject("Cannot send Empty Message");
    }

    const data = JSON.stringify(payload);
    const config = {
      method: "post",
      url: conf.slackApi.webhook.url,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
}

module.exports = serviceDef;
