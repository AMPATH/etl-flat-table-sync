# ETL Sync Service
 
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
    
## Project set up

1. Fork the project
2. Clone the project
3. Create a conf folder in the root directory with config.json file with the following configuration

```json
{
  "mysql": {
    "connectionLimit": 5,
    "host": "The IP or hostname of the  mysql server",
    "port": "<mysql port>",
    "user": "<mysql user>",
    "password": "<mysql password>",
    "multipleStatements": true
  },
  "slackApi": {
    "webhook": {
      "url": "webhookurl"
    }
  }
}
```

## Getting started

`npm install`
`npm start`

## Building and deployment

`docker build -f docker/Dockerfile -t ampathke/etl-flat-table-sync:<tag-version> .`

`docker run -d --restart unless-stopped --name etl-flat-table-sync --mount type=bind,source="/opt/etl-flat-table-sync",target="/usr/src/app/conf" ampathke/etl-flat-table-sync:<version> `
## Integration with Slack
The service integrates with Slack to provide real-time notifications and alerts for successful completions, failures, and other important events.
## Contributions
Contributions are welcome! If you would like to contribute to the ETL Sync Service, please follow the guidelines mentioned in the CONTRIBUTING.md file.

Please feel free to explore the repository for further information and instructions on how to use the ETL Sync Service in your projects.
