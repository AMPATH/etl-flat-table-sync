'use strict'
const syncManager = require('./service/sync-manager');
const timeOutInMs = 120000;

function syncBaseTables(){

  return syncManager.syncBaseTables();

}

function queuePatients(){
    return syncManager.queuePatients();
}

function updateSummaries(){
   return syncManager.updateSummaries();
}

function startSync(){
  console.log('startsync started ===========================');
  console.log('Start sync process...');
  syncBaseTables()
  .then((result) => {
    console.log('First chain..', result);
    return queuePatients();
  })
  .then((result) => {
    console.log('Second chain..', result);
    return updateSummaries();
  })
  .then((result) => {
    console.log('Third chain..', result);
    console.log('startsync finished ===========================');
    return startSync();
  })
  .catch((error) => {
     console.log('Catch..', error);
     console.log(`Sync failed .. waiting for ${timeOutInMs}`);
     setTimeout(()=> {
       return startSync();
     },120000);
  });
}


startSync();
// syncBaseTables();
// queuePatients();
// updateSummaries();