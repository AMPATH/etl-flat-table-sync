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

  return new Promise((resolve,reject) => {
  const sql = `call build_flat_hiv_summary("build",600,100,1);`;
  console.log("sql", sql);
  connection
    .getConnectionPool()
    .then((pool) => {
      pool.query(sql, function (error, results, fields) {
        if (error) {
          console.log("Error", error);
          reject(error);
        } else {
          console.log("Update Hiv Summary successfull: ", results);
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

function updateFlatAppointment(){

  return new Promise((resolve,reject) => {
  const sql = `call build_flat_appointment("build",800,100,1);`;
  console.log("sql", sql);
  connection
    .getConnectionPool()
    .then((pool) => {
      pool.query(sql, function (error, results, fields) {
        if (error) {
          console.log("Error", error);
          reject(error);
        } else {
          console.log("Update Flat Appointment successfull: ", results);
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

function updateFlatObs(){

  return new Promise((resolve,reject) => {
  const sql = `call generate_flat_obs_v_1_3();`;
  console.log("sql", sql);
  connection
    .getConnectionPool()
    .then((pool) => {
      pool.query(sql, function (error, results, fields) {
        if (error) {
          console.log("Error", error);
          reject(error);
        } else {
          console.log("Update Flat Obs successfull: ", results);
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


function updateFlatLabObs(){

  return new Promise((resolve,reject) => {
  const sql = `call generate_flat_lab_obs();`;
  console.log("sql", sql);
  connection
    .getConnectionPool()
    .then((pool) => {
      pool.query(sql, function (error, results, fields) {
        if (error) {
          console.log("Error", error);
          reject(error);
        } else {
          console.log("Update Flat Lab Obs successfull: ", results);
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

function updateFlatOrders(){

  return new Promise((resolve,reject) => {
  const sql = `call generate_flat_orders();`;
  console.log("sql", sql);
  connection
    .getConnectionPool()
    .then((pool) => {
      pool.query(sql, function (error, results, fields) {
        if (error) {
          console.log("Error", error);
          reject(error);
        } else {
          console.log("Update Flat Orders successfull: ", results);
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

function updateLabsAndImaging(){
  return new Promise((resolve,reject) => {
    const sql = `call generate_flat_labs_and_imaging("sync",1,15000,100);`;
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