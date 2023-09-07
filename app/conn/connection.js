'use strict';

const mysql = require('mysql');
const config = require('../../conf/config.json');
// Create connection

const connectionPool = mysql.createPool({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
  port: config.mysql.port,
  connectionLimit: config.mysql.connectionLimit,
});

const amrsConnectionPool = mysql.createPool({
  host: config.amrsmysql.host,
  user: config.amrsmysql.user,
  password: config.amrsmysql.password,
  database: config.amrsmysql.database,
  port: config.amrsmysql.port,
  connectionLimit: config.amrsmysql.connectionLimit,
});

module.exports = {
  connectionPool: connectionPool,
  amrsConnectionPool: amrsConnectionPool
};
