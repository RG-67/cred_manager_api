const express = require('express');
const parser = require('body-parser');
const cors = require('cors');
const supabase = require('./db');
const userDetailsRoute = require('./router/userDetailsRoute');
const userCred = require('./router/userCredRoute');

require('dotenv').config();

const path = "/app/v1";
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(parser.json());

app.use(`${path}/user`, userDetailsRoute);
app.use(`${path}/userCred`, userCred);



app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});