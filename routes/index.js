var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  const data = "Hello World";
  // Access db from the request object
  req.db.collection('data').add({data: data})
      .then(() => res.render('index', { title: 'Express' }))
      .catch(error => next(error)); // Handle errors
});

module.exports = router;
