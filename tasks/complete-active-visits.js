/**
 *
 * This code implementation is not ideal for accomplishing the task efficiently.(Just a short-term remedy)
 * A recommended approach would be to utilize the OpenMRS scheduler to automatically complete visits at midnight.
 * The current implementation seems to be a short-term remedy and it has several issues;
 *  - One major concern is that it directly modifies the database without going through the OpenMRS service layer.
 *  - This can lead to inconsistencies and potential problems in the future.
 *  - Short-cuts
 * 
 * It is crucial to follow the proper architecture and utilize the designated services provided by OpenMRS for any database-related operations.
 * 
 */

const { amrsConnectionPool } = require('../app/conn/connection');

// Verify MySQL connection
amrsConnectionPool.connect((error) => {
  if (error) {
    console.error('Error connecting to MySQL database:', error.stack);
    return;
  }

  console.log('Connected to MySQL database as ID', connection.threadId);

  // Select rows with date_stopped and update them in batches
  const batchSize = 1000; // Adjust this number based on the available memory

  const updateBatch = () => {
    const selectQuery = `SELECT * FROM amrs.visit WHERE date_stopped IS NULL AND voided = 0 LIMIT ${batchSize}`;
    connection.query(selectQuery, (error, results) => {
      if (error) throw error;

      if (results.length === 0) {
        console.log('All rows updated successfully!');
        connection.end();
        return;
      }

      results.forEach((row) => {
        // Update the row by adding now() to date_stopped and setting date_changed and changed_by
        const updateQuery = `UPDATE amrs.visit SET date_stopped = NOW(), date_changed = NOW(), changed_by = 168362 WHERE visit_id = ${row.visit_id}`;
        connection.query(updateQuery, (error, result) => {
          if (error) throw error;

          console.log(`Row ${row.visit_id} updated successfully!`);
        });
      });

      updateBatch();
    });
  };

  updateBatch();
});
