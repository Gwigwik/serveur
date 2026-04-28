const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get('/plop', userController.getUsers);
router.post('/plop', userController.createUser);

module.exports = router;