'use strict';
const connection = require('../connection/connection');

const def = {
  generateHivSummarySyncQueue,
  generateFlatAppointmentSyncQueue
}

function generateHivSummarySyncQueue(){

  return new Promise((resolve,reject) => {
  const sql = `call generate_flat_hiv_summary_sync_queue();`;
  console.log("sql", sql);
  connection
    .getConnectionPool()
    .then((pool) => {
      pool.query(sql, function (error, results, fields) {
        if (error) {
          console.log("Query Error", error);
          reject(error);
        } else {
          console.log("Generate Hiv Summary Sync Queue successfull: ", results);
          resolve(results);
        }
      });
    })
    .catch((error) => {
      console.log('Error: generateHivSummarySyncQueue', error);
      reject(error);
    });

  });
  
}

function generateFlatAppointmentSyncQueue(){

  return new Promise((resolve,reject) => {
  const sql = `call generate_flat_appointment_sync_queue();`;
  console.log("sql", sql);
  connection
    .getConnectionPool()
    .then((pool) => {
      pool.query(sql, function (error, results, fields) {
        if (error) {
          console.log("Error", error);
          reject(error);
        } else {
          console.log("Generate Flat Appointment Sync Queue successfull: ", results);
          resolve(results);
        }
      });
    })
    .catch((error) => {
      console.log('Error: generateFlatAppointmentSyncQueue', error);
      reject(error);
    });

  });
  
}

module.exports = def;