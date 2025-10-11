const express = require('express');
const parser = require('body-parser');
const cors = require('cors');
const pool = require('./db');

require('dotenv').config();

const path = "/app/v1";
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(parser.json());

app.post(`${path}/insertUser`, async (req, res) => {
    const {
        id,
        userId,
        userPhone,
        password,
        deviceId
    } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO UserDetails (
            id, userid, userphone, password, deviceid) VALUES
            ($1, $2, $3, $4, $5) RETURNING *`, [
            id, userId, userPhone, password, deviceId
        ]);
        res.status(201).json({ status: true, msg: "User insert successfully", data: result.rows[0] });
    } catch (err) {
        console.log("Error in inserting user: ", err);
        res.status(500).json({ status: false, msg: "Failed to insert data", data: [] });
    }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});