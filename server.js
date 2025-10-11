const express = require('express');
const parser = require('body-parser');
const cors = require('cors');
const supabase = require('./db');

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
        const { data, error } = await supabase
            .from('userdetails')
            .insert([
                {
                    id: id,
                    userid: userId,
                    userphone: userPhone,
                    password: password,
                    deviceid: deviceId
                }
            ]).select();
        if (error) {
            console.log("Supabase insert error: ", error);
            return res.status(500).json({ status: false, msg: 'Failed to insert data', data: [] });
        }
        res.status(201).json({ status: true, msg: "User insert successfully", data: data[0] });
    } catch (err) {
        console.log("Unexpected error: ", err);
        res.status(500).json({ status: false, msg: "Server error", data: [] });
    }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});