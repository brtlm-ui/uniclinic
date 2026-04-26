const express = require('express');
const router = express.Router();
const UserController = require('../Controller/userController');

router.post('/login',  UserController.loginUser);
router.get('/',        UserController.getAllStaff);
router.get('/:id',     UserController.getStaffById);
router.post('/',       UserController.registerStaff);
router.put('/:id',     UserController.updateStaff);
router.delete('/:id',  UserController.deleteStaff);

module.exports = router;
