const createError = require('http-errors');
const express = require('express');
const app = express();

const routes = require('./routes/index');
const config = require('./config');

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routes);

app.use((err, req, res, next) => res.status(err.status || 500).json({ error: err.toString() }));

app.listen(config.port, err => {
    if (err) return console.error(`server could not be started on port ${config.port}`, err);
    console.log(`server is listening on ${config.port}`)
});