const cron = require('node-cron');
const { spawn } = require('child_process');
const fs = require('fs');

// Load tasks from tasks.json
const tasksFile = './conf/tasks.json';
const tasks = JSON.parse(fs.readFileSync(tasksFile, 'utf8'));

// Function to execute a Node.js script
const executeScript = (script) => {
  const child = spawn('node', [script]);

  child.stdout.on('data', (data) => {
    console.log(`🔰 [${script}] stdout: ${data}`);
  });

  child.stderr.on('data', (data) => {
    console.error(`🔰 [${script}] stderr: ${data}`);
  });

  child.on('close', (code) => {
    console.log(`🔰 [${script}] exited with code ${code}`);
  });
};

// Schedule tasks
const scheduleTasks = () => {
  tasks.forEach((task) => {
    if (task.enabled) {
      cron.schedule(task.schedule, () => {
        console.log(`🔰 Executing [${task.script}] task...`);
        executeScript(task.script);
      });
    } else {
      console.log(`🔰 Task [${task.script}] is disabled.`);
    }
  });
};

exports.scheduleTasks = scheduleTasks;
