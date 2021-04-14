'use strict';
const connection = require('../connection/connection');

const def = {
  updateHivSummary,
  updateFlatAppointment,
  updateFlatObs,
  updateFlatLabObs,
  updateFlatOrders,
  updateLabsAndImaging
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
            console.log("Update Labs and imaging successfull: ", results);
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