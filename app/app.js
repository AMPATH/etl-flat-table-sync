'use strict';
const moment = require('moment');
const TIMEOUT_INTERVAL = 60 * 1000; // 60 seconds

const { syncBaseTables } = require('./base-sync');
const { syncFlatTables } = require('./process-manager');

const dayTimeSync = async () => {
  console.log(
    moment().format('YYYY-MM-DD HH:mm:ss') + ': Day time sync process started'
  );
  await syncBaseTables()
    .then(async (res) => {
      if (res) {
        console.log(
          moment().format('YYYY-MM-DD HH:mm:ss') +
            ': Base tables sync process completed'
        );
        await syncFlatTables('day');
        console.log(
          moment().format('YYYY-MM-DD HH:mm:ss') +
            ': Day time sync process completed'
        );
        setTimeout(async () => {
          await startSync();
        }, TIMEOUT_INTERVAL);
      }
    })
    .catch((error) => {
      console.error('Error syncing base tables:', error);
      setTimeout(() => {
        this.startSync();
      }, TIMEOUT_INTERVAL);
    });
};

const nightTimeSync = async () => {
  syncBaseTables()
    .then(async (res) => {
      if (res) {
        console.log(
          moment().format('YYYY-MM-DD HH:mm:ss') +
            ': Base tables sync process completed'
        );
        await syncFlatTables('night');
        console.log(
          moment().format('YYYY-MM-DD HH:mm:ss') +
            ': Night time sync process completed'
        );

        setTimeout(async () => {
          await startSync();
        }, TIMEOUT_INTERVAL);
      }
    })
    .catch((error) => {
      console.error('Error syncing base tables:', error);
      setTimeout(async () => {
        await startSync();
      }, TIMEOUT_INTERVAL);
    });
};

const startSync = async () => {
  console.log(
    '#### <<< sync process started at ' +
      moment().format('YYYY-MM-DD HH:mm:ss') +
      ' >>> ####'
  );

  const hour = moment().format('HH');
  if (hour >= 6 && hour < 21) {
    await dayTimeSync();
  } else {
    await nightTimeSync();
  }
};

startSync();
