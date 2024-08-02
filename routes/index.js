var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  const data = "Hello World";
  // Access db from the request object
/*  req.db.collection('data').add({data: data})
      .then(() => res.render('index', { title: 'Express' }))
      .catch(error => next(error)); // Handle errors*/
});

router.post('/', function(req, res, next) {
  //anwser to the post request with the data obj
  const data = {
    name: 'juan',
    age: 22,
  }
  //answer with an ok
    res.status(200).send(data);
});

module.exports = router;
