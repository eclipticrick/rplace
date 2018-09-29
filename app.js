const createError = require('http-errors'),
      express = require('express'),
      app = express();

const routes = require('./routes/index'),
      config = require('./config');

app.use('/', routes);
app.use((err, req, res, next) => next(createError(err.status || 500, err.toString())));

app.listen(config.port, err => {
    if (err) return console.error(`server could not be started on port ${config.port}`, err);
    console.log(`server is listening on ${config.port}`)
});