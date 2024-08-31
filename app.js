const createError = require('http-errors');
const express = require('express');
const cors = require('cors')
const axios = require('axios');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const flameGraphRouter = require('./routes/flame_graph');
const flameGraphDateRouter = require('./routes/flame_graph_date');
const flameGraphMemoryRouter = require('./routes/flame_graph_memory');
const flameGraphMemoryDateRouter = require('./routes/flame_graph_memory_date');

const app = express();
//allow all origins
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));


const url = `https://devprobeapi.onrender.com/`; // Replace with your Render URL
const interval = 30000; // Interval in milliseconds (30 seconds)

function reloadWebsite() {
    axios.get(url)
        .then(response => {
            console.log(`Reloaded at ${new Date().toISOString()}: Status Code ${response.status}`);
        })
        .catch(error => {
            console.error(`Error reloading at ${new Date().toISOString()}:`, error.message);
        });
}


setInterval(reloadWebsite, interval);


// Connect to Firebase
const admin = require('firebase-admin');
const credentials = require('./key.json');

admin.initializeApp({
    credential: admin.credential.cert(credentials),
});

const db = admin.firestore();

app.use((req, res, next) => {
    req.db = db;
    next();
});




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/flame_graph', flameGraphRouter);
app.use('/flame_graph_date', flameGraphDateRouter);
app.use('/flame_graph_memory', flameGraphMemoryRouter);
app.use('/flame_graph_memory_date', flameGraphMemoryDateRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
