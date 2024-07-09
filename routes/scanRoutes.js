const express = require('express');
const {
  saveScan,
  getUsers,
  getUserDetails,
  getAllScans,
  generateExcelReport
} = require('../controllers/scanController');

const router = express.Router();

router.post('/save-scan', saveScan);
router.get('/users', getUsers);
router.get('/users/:id_unico', getUserDetails);
router.get('/scans', getAllScans);
router.get('/generate-excel-report', generateExcelReport);

module.exports = router;
