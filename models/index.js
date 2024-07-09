const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const User = require('./user');
const Scan = require('./scan');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = User;
db.Scan = Scan;

module.exports = db;
