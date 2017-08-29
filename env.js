const path = require('path');
const fs = require('fs');
const { readVersion } = require('./lib/version');

const driverName = process.env.DRIVER_NAME || 'postgresql';
const dbHostname = process.env.DB_HOSTNAME || 'localhost';
const dbUsername = process.env.DB_USERNAME || 'postgres';
const dbPassword = process.env.DB_PASSWORD || 'postgres';
const dbName = process.env.DB_NAME || 'postgres';
const dbPort = Number(process.env.DB_PORT) || 5432;
const defaultConnectionString = `${driverName}://${dbUsername}:${dbPassword}@${dbHostname}:${dbPort}/${dbName}`;

exports.schemaDir = process.env.SCHEMA_DIR || path.join(process.cwd(), 'db');
exports.connectionString = process.env.CONNECTION_STRING || defaultConnectionString;
exports.driverName = driverName;
exports.skipSchemaDump = !!process.env.NO_SCHEMA_DUMP;
exports.currentVersion = readVersion(exports.schemaDir);
