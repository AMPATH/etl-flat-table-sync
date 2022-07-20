'use strict';
const connection = require('../connection/connection');
const axios = require('axios');
const moment = require('moment');

const def = {
  updateHivSummary,
  batchUpdateHivSummary,
  updateFlatAppointment,
  updateFlatObs,
  updateFlatLabObs,
  updateFlatOrders,
  updateLabsAndImaging,
  updateVitals,
  updateBreastCancerScreening,
  updateCervicalScreening,
  updatePepSummary,
  updateDefaulters,
  updateCaseManager,
  updateFamilyTesting,
  findMissingHivMonthlyRecords,
  updateHivMonthlySummary,
  startSlave,
  killIdleConnections,
  updateSurgeWeeklyReport,
  updateCovidScreening,
  checkHivMissingRecords,
  updatePrepSummary,
  updatePrepMonthlySummary,
  updateHivCervicalCancerScreening,
  updateHivCervicalCancerScreeningMonthlySummary,
  updateHivTransferOutSummary,
  updateFlatDeathReporting,
  updateHIVTransferIns,
  updateFlatCdmSummary,
  updateSurgeDailyDataset,
  updateCovidExtractSummary,
  updateCovidMonthlySummary,
  updateFlatConsent
}

function updateHivSummary(){
  const sql = `call build_flat_hiv_summary("build",700,10,1);`;
  return runSqlScript(sql);  
}

function batchUpdateHivSummary(){
  const sql = `call build_flat_hiv_summary("build",800,10000,1);`;
  return runSqlScript(sql);  
}

function updateFlatAppointment(){
  const sql = `call etl.build_flat_appointment("build",700,10,1);`;
  return runSqlScript(sql);    
}

function updateFlatObs(){
  const sql = `call etl.generate_flat_obs_v_1_3();`;
  return runSqlScript(sql);    
}


function updateFlatLabObs(){
  const sql = `call generate_flat_lab_obs();`;
  return runSqlScript(sql);  
}

function updateFlatOrders(){
  const sql = `call etl.generate_flat_orders();`;
  return runSqlScript(sql);
}

function updateLabsAndImaging(){
  const sql = `call etl.generate_flat_labs_and_imaging("sync",1,15000,100);`
  return runSqlScript(sql);
}
function updateVitals (){
  const sql = `CALL etl.generate_flat_vitals_v2_2();`
  return runSqlScript(sql);
}

function updateBreastCancerScreening(){
  const sql = `CALL etl.generate_flat_breast_cancer_screening_v1_2("sync",1,15000,1);`
  return runSqlScript(sql);
}
function updateCervicalScreening(){
  const sql = `CALL etl.generate_flat_cervical_cancer_screening_v1_2("sync",1,100000,1);`
  return runSqlScript(sql);
}


function updatePepSummary(){
  const sql = `call generate_pep_summary();`
  return runSqlScript(sql);
}

function updateDefaulters(){
  const sql = `call etl.generate_defaulters();`
  return runSqlScript(sql);
}

function updateCaseManager(){
  const sql = `CALL etl.generate_flat_case_manager("sync",1,10000,10,1);`
  return runSqlScript(sql);
}

function updateFamilyTesting(){
  const sql = `CALL etl.generate_flat_family_testing("sync",1,15000,20,true);`
  return runSqlScript(sql);
}


function updateHivCervicalCancerScreening(){
  const sql = `CALL etl.generate_flat_cervical_cancer_screening_rc_v1_0("sync",1,100000,1);`
  return runSqlScript(sql);
}
function updateHivCervicalCancerScreeningMonthlySummary(){
  const sql = `CALL etl.generate_cervical_screening_monthly_report_v1_0("sync",1,10000,1,"2013-01-01");`
  return runSqlScript(sql);
}
function updateHivTransferOutSummary(){
  const sql = `CALL etl.generate_flat_transfers("sync",1,10000,1,"true");`
  return runSqlScript(sql);
}

function updateFlatDeathReporting(){
  const sql = `CALL etl.generate_flat_death_reporting("sync",1,10000,1,"true");`
  return runSqlScript(sql);
}

function updateHIVTransferIns(){
  const sql = `CALL etl.generate_flat_hiv_transfer_in("sync",1,10000,1,"true");`
  return runSqlScript(sql);
}

function findMissingHivMonthlyRecords(){
  const endMonth = moment().endOf('month').format("YYYY-DD-MM");
  const sql = `CALL etl.find_missing_hiv_monthly_records("${endMonth}");`
  return runSqlScript(sql);
}

function updateHivMonthlySummary(){
  const sql = `call etl.generate_hiv_monthly_report_dataset_v1_4("sync",1,100000,100,"2013-01-01");`
  return runSqlScript(sql);
}
function startSlave(){
  const sql = `start slave`
  return runSqlScript(sql);
}
function killIdleConnections(){
  const sql = `CALL etl.etl_kill_idle_processes();`
  return runSqlScript(sql);
}
function updateSurgeWeeklyReport(){
    const sql = `call etl.generate_surge_weekly_report_dataset_v1("sync",10,15000,100,true);`;
    return runSqlScript(sql);
}
function updatePrepSummary(){
  const sql = `CALL etl.generate_prep_summary_v1_1_prod("sync",102,15000,100,true);`;
  return runSqlScript(sql);
}
function updatePrepMonthlySummary(){
  const sql = `CALL etl.generate_prep_monthly_report_v1_prod("sync",101,15000,100,true);`;
  return runSqlScript(sql);
}
function updateCovidScreening(){
    const sql = `CALL etl.generate_flat_covid_screening_v1_0();`;
    return runSqlScript(sql);
}
function updateFlatCdmSummary(){
  const sql = `CALL etl.generate_flat_cdm_v1_0("sync",100,10000,1);`;
  return runSqlScript(sql);
}
function checkHivMissingRecords(){
    const sql = `CALL etl.find_missing_hiv_summary_records();`;
    return runSqlScript(sql);
}
function updateSurgeDailyDataset(){
    const NOW = moment().format('HH');
    let queueSize = 1;
    if(NOW >= 7 && NOW < 17){
       queueSize = 1;
    }else{
       queueSize = 100;
    }
   
    const sql = `call etl.generate_surge_daily_report_dataset_rri_v1_0("sync",880,${queueSize},1,false);`;
    return runSqlScript(sql);
}
function updateCovidExtractSummary(){
  const sql = `CALL etl.generate_flat_covid_extract("sync",100,100,1,1);`;
  return runSqlScript(sql);
}
function updateCovidMonthlySummary(){
  const sql = `CALL etl.generate_monthly_covid_extract_report("sync",1,100000,1,"2013-01-01");`;
  return runSqlScript(sql);
}
function updateFlatConsent(){
  const sql = `CALL etl.generate_flat_consent("sync",1,1000,1,"true");`;
  return runSqlScript(sql);
}

function runSqlScript(sqlQuery){
  return new Promise((resolve,reject) => {
    const sql = sqlQuery;
    console.log("sql", sql);
    connection
      .getConnectionPool()
      .then((pool) => {
        pool.query(sql, function (error, results, fields) {
          if (error) {
            console.log("Error", error);
            const errorPayload = {
              'sqlQuery': sqlQuery,
              'error': {
                sqlMessage: error
              }
            };
            reject(errorPayload);
          } else {
            console.log("Update successfull: ------------------------ ");
            resolve(results);
          }
        });
      })
      .catch((error) => {
        console.log('runSqlScript Error:', error);
        const errorPayload = {
          'sqlQuery': sqlQuery,
          'error': error
        };
        reject(errorPayload);
      });
  
    });

}

module.exports = def;