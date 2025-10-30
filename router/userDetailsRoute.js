const express = require('express');
const router = express.Router();
const { getAllUser, insertUser, getSingleUser, updateUser, sendOtp, verifyOtp, passwordChange } = require('../controller/userDetails');


router.get('/getAllUser', getAllUser).get('/getUserByPhone', getSingleUser).get('/sendOtp', sendOtp).get('/passwordChange', passwordChange);
router.post('/insertUser', insertUser);
router.put('/updateUser', updateUser);



module.exports = router;