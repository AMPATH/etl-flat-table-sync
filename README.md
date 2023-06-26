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
