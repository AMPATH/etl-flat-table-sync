'use strict'
const syncManager = require('./service/sync-manager');
const moment = require('moment');
const timeOutInMs = 120000;
let syncState = {
  'state': 'day',
  'modeSet': false
}

function syncBaseTables(){

  return syncManager.syncBaseTables();

}

function queuePatients(){
    return syncManager.queuePatients();
}

function updateSummaries(){
   return syncManager.updateSummaries();
}
function nighlyUpdates(){
   return syncManager.nightlyUpdates();
}
function maintenance(){
    return syncManager.maintenance();
}

function dayTimeSync(){
  console.log('daytime startsync started ===========================');
  console.log('Start sync process...');
  syncBaseTables()
  .then((result) => {
    console.log('Queueing patients started ....');
    return queuePatients();
  })
  .then((result) => {
    console.log('Updating summaries started .....');
    return updateSummaries();
  })
  .then((result) => {
    console.log('daytimesync finished ===========================');
    return startSync();
  })
  .catch((error) => {
     console.log('Catch..', error);
     console.log(`Sync failed .. waiting for ${timeOutInMs}`);
     setTimeout(()=> {
       return startSync();
     },timeOutInMs);
  });
}

function nightTimeSync(){
  nighlyUpdates()
  .then((result) => {
    console.log('Night Time updates done ...', result);
    startSync();
  })
  .catch((error) => {
     console.log('NighttimeUpdates error ...', error);
     setTimeout(() => {
       startSync();
     },timeOutInMs);
  });
}

function startSync(){
   console.log('sync process started ===========================');
   maintenance();
   const NOW = moment().format('HH');
   console.log('NOW :', NOW);
   if(NOW < 21){
       if(!syncState.modeSet){
           syncState.modeSet = true;
           syncState.state = 'day'
        }
    }else{
       if(!syncState.modeSet){
           syncState.modeSet = true;
           syncState.state = 'night'
        }
       
    }

   console.log('SyncState :', JSON.stringify(syncState));

   if(syncState.state === 'day' && syncState.modeSet){
      syncState.modeSet = false;
      dayTimeSync()
   }else if(syncState.state === 'night' && syncState.modeSet){
     syncState.state = 'day';
     syncState.modeSet = false;
     nightTimeSync();
   }

}


startSync();
// syncBaseTables();
// queuePatients();
// updateSummaries();