const express = require('express');
const router = express.Router();
const { getAllUser, insertUser, getSingleUser, updateUser, verifyByPhone } = require('../controller/userDetails');


router.get('/getAllUser', getAllUser).get('/getUserByPhone', getSingleUser);
router.post('/insertUser', insertUser);
router.put('/updateUser', updateUser);



module.exports = router;