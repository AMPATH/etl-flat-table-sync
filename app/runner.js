'use strict';

const { connectionPool } = require('./conn/connection');

const runStoredProc = (procedure) => {
  return new Promise((resolve, reject) => {
    // Acquire connection
    connectionPool.getConnection((err, connection) => {
      if (err) {
        console.error('Error acquiring connection:', err.message);
        reject(err);
        return;
      } else {
        // Run the procedure
        console.log('Running procedure:', procedure);
        connection.query(procedure, (error, results) => {
          // Release connection
          connection.release();
          if (error) {
            console.error('Error running procedure:', error.message);
            reject(error);
            return;
          } else {
            resolve(results);
          }
        });
      }
    });
  });
};

exports.runStoredProc = runStoredProc;
