const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('u196388150_SDC', 'u196388150_SDC', '88#&LQu1jR&81$', {
  host: '154.56.47.52',
  dialect: 'mysql',
  timezone: 'America/Mexico_City', // Configuración de zona horaria para Sequelize
  dialectOptions: {
    timezone: 'local', // Configuración de zona horaria para la conexión MySQL
  },
  logging: console.log, // Para depurar, puedes usar console.log para ver las consultas SQL
});

module.exports = sequelize;
