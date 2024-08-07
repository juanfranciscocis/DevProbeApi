const express = require('express');
const router = express.Router();
const {getFlameGraph} = require('../controllers/get_flame_graph'); // Correct the import

router.get('/', getFlameGraph); // Use the correct function as a callback

module.exports = router;