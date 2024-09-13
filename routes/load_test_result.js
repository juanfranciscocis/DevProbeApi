var express = require('express');
const {join} = require("node:path");
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
    //res the result.html file
    res.sendFile(join(__dirname, '../controllers/load_test/report_html/report.html'));
});

module.exports = router;
