# ETL Sync Service
[![Node.js CI](https://github.com/AMPATH/etl-flat-table-sync/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/AMPATH/etl-flat-table-sync/actions/workflows/node.js.yml)
 
ETL Sync Service enables seamless synchronization of data between AMRS DB and ETL Flat tables, ensuring data consistency and integrity.

## Pre-requisites
- Node Js >= 12
- Docker

## Project structure
The repository is organized as follows:
   - *app/*: Contains the source code for the ETL Sync Service.
   - *tests/*: Contains the test cases to verify the functionality of the service.
   - *conf/*: Includes configuration files required for the service.
   - *docker/*: Contains docker files.

## JSON Sync jobs configuration
The JSON configuration provided [here](https://github.com/AMPATH/etl-flat-table-sync/blob/main/conf/sync-jobs.json) is used to define a set of jobs that can be executed as part of an ETL process. The configurations consist of two main sections: **jobs** and **children**. Each job represents a specific task to be performed and can have child jobs nested within it.

### Structure
The JSON configuration has the following structure:
```javascript
{
  "jobs": {
    "day": [ ... ],
    "night": [ ... ]
  }
}
```
- **jobs**: The main object that contains the job definitions.
- **day** and **night**: Two categories of jobs representing tasks to be executed during the day and night, respectively. Each category contains an array of job objects.

### Job Object
A job object represents a specific task and contains the following properties:

- **name** (string): The name or description of the job.
- **procedure** (string): The procedure or function to be executed as part of the job.
- **priority** (integer): The priority of the job. Jobs with lower priority values are executed first.
- **isEnabled** (boolean): Indicates whether the job is enabled or disabled. Disabled jobs are not executed.
- **children** (array): An optional array of child job objects nested within the current job. Children's jobs are executed after the parent's job completes.

#### Example
Here's an example of a job object
```javascript
{
  "name": "Generate HIV Summary Queue",
  "procedure": "CALL etl.generate_flat_hiv_summary_sync_queue();",
  "priority": 1,
  "isEnabled": true,
  "children": [ ... ]
}
```
### Child Jobs
Some jobs can have child jobs nested within them. Child jobs follow the same structure as the parent jobs and represent subtasks to be executed after the parent job completes. Child jobs are defined within the children's array of job objects.

#### Example
Here's an example of a job object with child jobs:
```javascript
{
  "name": "Generate HIV Summary Queue",
  "procedure": "CALL etl.generate_flat_hiv_summary_sync_queue();",
  "priority": 1,
  "isEnabled": true,
  "children": [
    {
      "name": "Update HIV Summary",
      "procedure": "CALL etl.build_flat_hiv_summary('build',700,25,1);",
      "priority": 2,
      "isEnabled": true,
      "children": []
    },
    ...
  ]
}
```

### Usage
The JSON configuration is used to execute the defined jobs in a specific order based on their priority and dependencies. The process should iterate over the job categories (`"day"` and `"night"`) and execute the jobs in the given order.

For each job, the ETL process should perform the following steps:

1. Check the `"isEnabled"` property of the job. If it is set to `"false"`, skip the job and proceed to the next one.
2. Execute the procedure specified in the `"procedure"` property of the job.
3. If the job has child jobs (`"children"` array is not empty), recursively execute each child job following the same steps.

## Building and deployment

Docker build
```bash
docker build -f docker/Dockerfile -t ampathke/etl-flat-table-sync:<tag-version> .
```
Docker run/start the service

```shell
docker run -d --restart unless-stopped --name etl-flat-table-sync --mount type=bind,source="/opt/etl-flat-table-sync",target="/usr/src/app/conf" ampathke/etl-flat-table-sync:<version> 
```
## Integration with Slack
The service integrates with Slack to provide real-time notifications and alerts for successful completions, failures, and other important events.
## Contributions
Contributions are welcome! If you would like to contribute to the ETL Sync Service, please follow the guidelines mentioned in the CONTRIBUTING.md file.

Please feel free to explore the repository for further information and instructions on how to use the ETL Sync Service in your projects.
