'use strict';

const fs = require('fs');
const { runStoredProc } = require('./runner');
const moment = require('moment');

const syncFlatTables = async (time) => {
  try {
    // Read the JSON config file
    const config = JSON.parse(fs.readFileSync('./conf/config.json', 'utf8'));

    // Validate the config structure
    if (!config || !config.jobs || !config.jobs.day || !config.jobs.night) {
      throw new Error('Invalid config structure');
    }

    if (time && time === 'day') {
      // Process the day jobs
      await processJobs(config.jobs.day, 'day');
    } else {
      // Process the night jobs
      await processJobs(config.jobs.night, 'night');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

const processJobs = async (jobs, time) => {
  // Check if there are any jobs
  if (!jobs || jobs.length === 0) {
    console.log(`No ${time} jobs found.`);
    return;
  }

  // Sort jobs based on priority
  jobs.sort((a, b) => a.priority - b.priority);

  // Process each job
  for (const job of jobs) {
    try {
      // Validate the job properties
      if (!job.name || !job.procedure || !job.priority) {
        throw new Error(`Invalid << ${job.name} >> job structure`);
      }

      if (!job.isEnabled) {
        console.log(`Skipping ${time} job: ${job.name}`);
        continue;
      }

      // Perform the job task
      console.log(`${moment().format('YYYY-MM-DD HH:mm:ss')}: Processing ${time} job >> ${job.name}`);
      console.log(`${moment().format('YYYY-MM-DD HH:mm:ss')}: Priority: ${job.priority} Enabled: ${job.isEnabled}`);
      await runStoredProc(job.procedure);

      // Process the child jobs recursively
      if (job.children && job.children.length > 0) {
        processJobs(job.children, time);
      }
    } catch (error) {
      console.error('Error processing job:', error.message);
    }
  }
};

exports.syncFlatTables = syncFlatTables;
