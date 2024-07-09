const express = require('express');
const { getUsers, getUserDetails } = require('../controllers/userController');

const router = express.Router();

router.get('/', getUsers);
router.get('/:id_unico', getUserDetails);

module.exports = router;
