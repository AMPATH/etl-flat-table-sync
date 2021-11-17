'use strict';
const queueService = require('./queue-service');
const syncService = require('./sync-service');
const slackService = require('./slack-service');

const def = {
  syncBaseTables,
  queuePatients,
  updateSummaries,
  nightlyUpdates,
  maintenance
}

function maintenance(){
  return new Promise(async (resolve,reject) => {
      // await syncService.startSlave();
      // await syncService.killIdleConnections();
      resolve('Maintenance done ..');

  });

}

async function syncBaseTables(){

  return new Promise(async (resolve, reject) => {

  try{
    await syncService.updateFlatObs();
    await syncService.updateFlatLabObs();
    await syncService.updateFlatOrders();
    resolve('syncBaseTables successfull');

  }catch(e){
      console.log("nightlyUpdates ERROR", e);
      const defaultErrorMsg = 'Nightly Failed encoutered an error';
      const payload = {
        "text": `ERROR : ${e.error.sqlMessage ? e.error.sqlMessage : defaultErrorMsg} : Query : ${e.sqlQuery}`
      };
      slackService.postChannelMesssage(payload).then((res)=>{
        reject("Nightly Updates skipped after error..");
      }).catch((error)=>{
        reject(error);
      });
     
  }

});

 
  
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
      const defaultErrorMsg = 'Updating Summaries Failed encoutered an error';
      const payload = {
        "text": `ERROR : ${e.error.sqlMessage ? e.error.sqlMessage : defaultErrorMsg}: Query : ${e.sqlQuery}`
      };
      slackService.postChannelMesssage(payload).then((res)=>{
        reject("Update Summaries skipped after error..");
      }).catch((error)=>{
        reject(error);
      });
    }
  });
}


function nightlyUpdates(){
  return new Promise(async (resolve,reject) => {
    try{
      await syncService.updateVitals();
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
      await syncService.updateFlatCdmSummary();
      resolve('Done nightly updates ...');
    } catch(e){
      console.log("nightlyUpdates ERROR", e);
      const defaultErrorMsg = 'Nightly Failed encoutered an error';
      const payload = {
        "text": `ERROR : ${e.error.sqlMessage ? e.errorsqlMessage : defaultErrorMsg} : Query : ${e.sqlQuery}`
      };
      slackService.postChannelMesssage(payload).then((res)=>{
        reject("Nightly Updates skipped after error..");
      }).catch((error)=>{
        reject(error);
      });

    }

    

  });

}




module.exports = def;