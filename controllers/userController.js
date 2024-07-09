const { Op } = require('sequelize');
const { Scan } = require('../models');
const moment = require('moment-timezone');
const TIMEZONE = 'America/Mexico_City';

// Obtener todos los usuarios únicos
const getUsers = async (req, res) => {
  try {
    const users = await Scan.findAll({
      attributes: ['id_unico', 'name'],
      group: ['id_unico', 'name']
    });

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Failed to fetch users');
  }
};

// Obtener detalles de un usuario específico
const getUserDetails = async (req, res) => {
  const { id_unico } = req.params;

  try {
    const startOfWeek = moment().tz(TIMEZONE).startOf('week').toDate();
    const endOfWeek = moment().tz(TIMEZONE).endOf('week').toDate();

    const userDetails = await Scan.findAll({
      where: {
        id_unico,
        timestamp: {
          [Op.between]: [startOfWeek, endOfWeek]
        }
      },
      order: [['timestamp', 'DESC']]
    });

    res.status(200).json(userDetails);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).send('Failed to fetch user details');
  }
};

module.exports = {
  getUsers,
  getUserDetails
};
