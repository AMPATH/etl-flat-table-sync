# ETL Flat Table Sync
This project is aimed at updating the etl flat tables

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



## Requirements
1. Node Version 12
2. Docker

## Getting started
```npm install```
```npm start```

## Building and deployment
```docker build -f Dockerfile -t 10.50.80.56:5005/etl-flat-table-sync:<version> .```

```docker run -d -it --name etl-flat-table-sync --mount type=bind,source="absolute path to conf folder",target=/usr/app/conf 10.50.80.56:5005/etl-flat-table-sync:<version> ```


