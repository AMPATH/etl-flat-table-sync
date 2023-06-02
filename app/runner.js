'use strict';

const { connectionPool } = require('./conn/connection');
const moment = require('moment');

const runStoredProc = (procedure) => {
  return new Promise((resolve, reject) => {
    // Acquire connection
    connectionPool.getConnection((err, connection) => {
      if (err) {
        console.error(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]: Error acquiring connection >>`, err.message);
        reject(err);
        return;
      } else {
        // Run the procedure
        console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]: Running procedure:`, procedure);
        connection.query(procedure, (error, results) => {
          // Release connection
          connection.release();
          if (error) {
            console.error(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]: Error running procedure >>`, error.message);
            reject(error);
            return;
          } else {
            resolve(results);
            console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]: Procedure completed successfully.`);
          }
        });
      }
    });
  });
};

exports.runStoredProc = runStoredProc;
