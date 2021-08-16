'use strict';
const queueService = require('./queue-service');
const syncService = require('./sync-service');

const def = {
  syncBaseTables,
  queuePatients,
  updateSummaries,
  nightlyUpdates,
  maintenance
}

function maintenance(){
  return new Promise(async (resolve,reject) => {
      await syncService.startSlave();
      await syncService.killIdleConnections();
      resolve('Maintenance done ..');

  });

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
      resolve('All summaries updated done');
    });
 
}

function updateSummaries() {
  return new Promise(async (resolve, reject) => {
    try {
      await syncService.updateLabsAndImaging();
      console.log("Done Labs and imaging....");
      await syncService.updateHivSummary();
      console.log("Done Hiv Summary....");
      await syncService.updateFlatAppointment();
      console.log("Done Flat Appointment....");
      resolve("Done updateSummaries ...");
    } catch (e) {
      console.log("Update Summaries Error..", e);
      resolve("Update Summaries skipped after error..");
    }
  });
}


function nightlyUpdates(){
  return new Promise(async (resolve,reject) => {
      await syncService.updateVitals();
      // await syncService.updateBreastCancerScreening();
      await syncService.updateCervicalScreening();
      await syncService.updateHivCervicalCancerScreening();
      await syncService.updateHivCervicalCancerScreeningMonthlySummary();
      await syncService.updateHivTransferOutSummary();
      await syncService.updateFlatDeathReporting();
      await syncService.updateHIVTransferIns();
      await syncService.updatePepSummary();
      await syncService.updateDefaulters();
      await syncService.updateCaseManager();
      await syncService.updateFamilyTesting();
      await syncService.updateHivMonthlySummary();
      await syncService.updateSurgeWeeklyReport();
      await syncService.updateCovidScreening();
      await syncService.updatePrepSummary();
      await syncService.updatePrepMonthlySummary();
      resolve('Done nightly updates ...');

    

  });

}




module.exports = def;