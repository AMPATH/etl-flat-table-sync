'use strict';

const { connectionPool } = require('./conn/connection');
const moment = require('moment');
const { postToSlack } = require('./service/slack.service');

const runStoredProc = (meta) => {
  return new Promise((resolve, reject) => {
    // Acquire connection
    connectionPool.getConnection((err, connection) => {
      if (err) {
        console.error(
          `❌ [${moment().format(
            'YYYY-MM-DD HH:mm:ss'
          )}]: Error acquiring connection >>`,
          err.message
        );
        reject(err);
        return;
      } else {
        // Run the procedure
        console.log(
          `🔄 [${moment().format('YYYY-MM-DD HH:mm:ss')}]: Running procedure:`,
          meta.procedure
        );
        connection.query(meta.procedure, (error, results) => {
          // Release connection
          connection.release();
          if (error) {
            console.error(
              `❌ [${moment().format(
                'YYYY-MM-DD HH:mm:ss'
              )}]: Error running procedure >>`,
              error.message
            );
            const slackMessage = `
            * <!channel> ❌❌ ETL Flat Table Sync Service*
            - *Procedure:* ${meta.procedure}
            - *Error:* ${error.message}
            - *Time:* ${moment().format('YYYY-MM-DD HH:mm:ss')}
            `;
            postToSlack(slackMessage);
            reject(error);
            return;
          } else {
            resolve(results);
            console.log(
              `✅ [${moment().format('YYYY-MM-DD HH:mm:ss')}]: ${
                meta.name
              } completed successfully.`
            );
          }
        });
      }
    });
  });
};

exports.runStoredProc = runStoredProc;
