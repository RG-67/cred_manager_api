const express = require('express');
const router = express.Router();
const { getAllUser, insertUser, getSingleUser, updateUser, verifyByPhone } = require('../controller/userDetails');


router.get('/getAllUser', getAllUser).get('/getUserByPhone', getSingleUser).get('/verifyByPhone', verifyByPhone);
router.post('/insertUser', insertUser);
router.put('/updateUser', updateUser);



module.exports = router;