'use strict';

const { runStoredProc } = require('./runner');
const { postToSlack } = require('./service/slack.service');

const updateFlatObs = async () => {
  const sql = `call etl.generate_flat_obs_v_1_3();`;
  return await runStoredProc({ procedure: sql, name: 'Flat Obs' });
};

const updateFlatLabObs = async () => {
  const sql = `call generate_flat_lab_obs();`;
  return await runStoredProc({ procedure: sql, name: 'Flat Lab Obs' });
};

const updateFlatOrders = async () => {
  const sql = `call etl.generate_flat_orders();`;
  return await runStoredProc({ procedure: sql, name: 'Flat Orders' });
};

const syncBaseTables = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      await updateFlatObs();
      await updateFlatLabObs();
      await updateFlatOrders();
      resolve(true);
    } catch (error) {
      console.error('❌ Error syncing base tables:', error);
      const slackMessage = ` * <!channel> ❌❌ ETL Flat Table Sync Service*
      - *Procedure:* syncBaseTables()
      - *Error:* ${error.message}
      - *Time:* ${moment().format('YYYY-MM-DD HH:mm:ss')}
      `;
      postToSlack(slackMessage);
      reject(error);
    }
  });
};

exports.syncBaseTables = syncBaseTables;
