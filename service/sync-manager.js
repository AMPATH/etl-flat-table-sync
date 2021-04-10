'use strict';
const queueService = require('./queue-service');
const syncService = require('./sync-service');

const def = {
  syncBaseTables,
  queuePatients,
  updateSummaries
}

function syncBaseTables(){
  return Promise.allSettled(
    [syncService.updateFlatObs(),
    syncService.updateFlatLabObs(),
    syncService.updateFlatOrders()]
    );
}

function queuePatients(){
  return new Promise((resolve,reject) => {
      const queues = [queueService.generateHivSummarySyncQueue(),
        queueService.generateFlatAppointmentSyncQueue(),
        ];
      
      queues.forEach(async (queue,index) => {
          await queue;
          console.log('Done', index);
      });
      resolve('All done');
    });
 
}

function updateSummaries(){
  return Promise.allSettled([
    syncService.updateHivSummary(),
    syncService.updateLabsAndImaging(),
    syncService.updateFlatAppointment()]
  );
}



module.exports = def;