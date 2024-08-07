var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {

  //check for db connection
    const db = req.db;
    if (!db) {
        return res.status(500).send({
            error: 'Database is not connected'
        });
    }

    //return ok
    res.status(200).send('Connected to the database');
});

module.exports = router;
