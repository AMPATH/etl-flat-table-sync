'use strict';
const connection = require('../connection/connection');

const def = {
  updateHivSummary,
  updateFlatAppointment,
  updateFlatObs,
  updateFlatLabObs,
  updateFlatOrders,
  updateLabsAndImaging,
  updateVitals,
  updateBreastCancerScreening,
  updateCervicalScreening,
  updateOncologyHistory,
  updatePepSummary,
  updateDefaulters,
  updateCaseManager,
  updateFamilyTesting,
  updateHivMonthlySummary,
  startSlave,
  killIdleConnections
}

function updateHivSummary(){
  const sql = `call build_flat_hiv_summary("build",600,100,1);`;
  return runSqlScript(sql);  
}

function updateFlatAppointment(){
  const sql = `call etl.build_flat_appointment("build",800,100,1);`;
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
  const sql = `CALL etl.generate_flat_breast_cancer_screening_v1_2("sync",1,5000,100);`
  return runSqlScript(sql);
}
function updateCervicalScreening(){
  const sql = `CALL etl.generate_flat_cervical_cancer_screening_v1_1("sync",1,5000,100);`
  return runSqlScript(sql);
}

function updateOncologyHistory(){ 
  const sql = `CALL etl.generate_flat_onc_patient_history_v1_0("sync",1,500,100);`
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
            reject(error);
          } else {
            console.log("Update successfull: ------------------------ ");
            resolve(results);
          }
        });
      })
      .catch((error) => {
        console.log('Error:', error);
        reject(error);
      });
  
    });

}

module.exports = def;