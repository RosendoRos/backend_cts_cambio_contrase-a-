const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('blmdi5de3s6kscoweugq', 'uwurw0skkxb959pv', 'mRVU6mvHbFZzwbKV6M7z', {
  host: 'blmdi5de3s6kscoweugq-mysql.services.clever-cloud.com',
  dialect: 'mysql',
  timezone: 'America/Mexico_City', // Configuración de zona horaria para Sequelize
  dialectOptions: {
    timezone: 'local', // Configuración de zona horaria para la conexión MySQL
  },
  logging: console.log, // Para depurar, puedes usar console.log para ver las consultas SQL
});

module.exports = sequelize;
