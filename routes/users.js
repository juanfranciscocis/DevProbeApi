var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  const { exec } = require('child_process');

  function logCpuTemperature() {
    exec('osx-cpu-temp', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing osx-cpu-temp: ${error.message}`);
        return;
      }

      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }

      console.log(`CPU Temperature: ${stdout.trim()}`);
    });
  }

// Log CPU temperature every 5 seconds
  setInterval(logCpuTemperature, 5000);

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
