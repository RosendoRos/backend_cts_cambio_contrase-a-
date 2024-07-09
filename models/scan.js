const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Scan = sequelize.define('Scan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  puesto: {
    type: DataTypes.STRING,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false
  },
  entrada_sali: {
    type: DataTypes.ENUM('entrada', 'salida'),
    allowNull: true
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  id_unico: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'scans',
  timestamps: false
});

module.exports = Scan;
