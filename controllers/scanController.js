const { Scan } = require('../models');
const moment = require('moment-timezone');
const { Op } = require('sequelize'); // Asegúrate de importar Op
const ExcelJS = require('exceljs'); // Asegúrate de tener ExcelJS instalado

const TIMEZONE = 'America/Mexico_City';

const calculateWeeklyHours = async (startOfWeek, endOfWeek) => {
  const users = await Scan.findAll({ attributes: ['id_unico'], group: ['id_unico'] });
  const userHours = {};

  for (const user of users) {
    const userEntries = await Scan.findAll({
      where: {
        id_unico: user.id_unico,
        timestamp: { [Op.between]: [startOfWeek, endOfWeek] }
      },
      order: [['timestamp', 'ASC']]
    });

    let totalMinutes = 0;
    let lastEntry = null;

    userEntries.forEach((entry) => {
      if (entry.entrada_sali === 'entrada') {
        lastEntry = moment.tz(entry.timestamp, TIMEZONE);
      } else if (entry.entrada_sali === 'salida' && lastEntry) {
        const endTime = moment.tz(entry.timestamp, TIMEZONE);
        const duration = moment.duration(endTime.diff(lastEntry));
        totalMinutes += duration.asMinutes();
        lastEntry = null;
      }
    });

    const totalHours = totalMinutes / 60;
    const horasExtras = totalHours > 40 ? totalHours - 40 : 0;

    userHours[user.id_unico] = {
      totalHours: totalHours.toFixed(2),
      horasExtras: horasExtras.toFixed(2)
    };
  }

  return userHours;
};


const saveScan = async (req, res) => {
  const { name, puesto, timestamp, entrada_sali, location, id_unico } = req.body;
  const { latitude, longitude } = location || {};

  // Asegúrate de ajustar la zona horaria de timestamp antes de guardar
  const localTimestamp = moment.tz(timestamp, TIMEZONE).format();

  const date = moment(localTimestamp).format('YYYY-MM-DD');

  try {
    const existingScan = await Scan.findOne({
      where: {
        id_unico,
        entrada_sali,
        timestamp: { [Op.startsWith]: date }
      }
    });

    if (existingScan) {
      return res.status(400).send(`Ya has registrado una ${entrada_sali} hoy`);
    }

    await Scan.create({ name, puesto, timestamp: localTimestamp, entrada_sali, latitude, longitude, id_unico });

    res.status(200).send('Scan data saved successfully and total hours updated');
  } catch (err) {
    console.error('Error inserting scan data:', err);
    res.status(500).send('Failed to save scan data');
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await Scan.findAll({ attributes: ['id_unico', 'name'], group: ['id_unico', 'name'] });
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).send('Failed to fetch users');
  }
};

const getUserDetails = async (req, res) => {
  const { id_unico } = req.params;

  try {
    const userDetails = await Scan.findAll({
      where: { id_unico },
      order: [['timestamp', 'DESC']]
    });
    res.status(200).json(userDetails);
  } catch (err) {
    console.error('Error fetching user details:', err);
    res.status(500).send('Failed to fetch user details');
  }
};

const getAllScans = async (req, res) => {
  try {
    const scans = await Scan.findAll();
    res.status(200).json(scans);
  } catch (err) {
    console.error('Error fetching scans:', err);
    res.status(500).send('Failed to fetch scans');
  }
};

const generateExcelReport = async (req, res) => {
  try {
    const startOfWeek = moment().tz(TIMEZONE).startOf('week').toDate();
    const endOfWeek = moment().tz(TIMEZONE).endOf('week').toDate();

    const userHours = await calculateWeeklyHours(startOfWeek, endOfWeek);

    const rows = await Scan.findAll({
      where: {
        timestamp: { [Op.between]: [startOfWeek, endOfWeek] }
      },
      order: [['id_unico', 'ASC'], ['timestamp', 'ASC']]
    });

    if (!Array.isArray(rows) || rows.length === 0) {
      throw new Error('No data found for the current week');
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Weekly Report');

    worksheet.columns = [
      { header: 'ID', key: 'id_unico', width: 10 },
      { header: 'Nombre', key: 'name', width: 30 },
      { header: 'Puesto', key: 'puesto', width: 30 },
      { header: 'Fecha y Hora', key: 'timestamp', width: 30 },
      { header: 'Acción', key: 'entrada_sali', width: 15 },
      { header: 'Latitud', key: 'latitude', width: 15 },
      { header: 'Longitud', key: 'longitude', width: 15 },
      { header: 'Horas Extras', key: 'horas_extras', width: 15 },
      { header: 'Total Horas', key: 'total_hours', width: 15 }
    ];

    rows.forEach((row) => {
      worksheet.addRow({
        id_unico: row.id_unico,
        name: row.name,
        puesto: row.puesto,
        timestamp: moment.tz(row.timestamp, TIMEZONE).format('YYYY-MM-DD HH:mm:ss'),
        entrada_sali: row.entrada_sali,
        latitude: row.latitude,
        longitude: row.longitude,
        horas_extras: userHours[row.id_unico]?.horasExtras || 0,
        total_hours: userHours[row.id_unico]?.totalHours || 0
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=weekly_report.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error generating Excel report:', error);
    res.status(500).send({ error: error.message });
  }
};


module.exports = {
  saveScan,
  getUsers,
  getUserDetails,
  getAllScans,
  generateExcelReport
};
