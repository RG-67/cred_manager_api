const express = require('express');
const router = express.Router();
const { getAllCred, insertUserCred, updateUserCred, deleteUserCred } = require('../controller/userCred');



router.get('/getAllCred', getAllCred);
router.post('/insertUserCred', insertUserCred);
router.post('/updateUserCred', updateUserCred);
router.delete('/deleteUserCred', deleteUserCred);





module.exports = router;