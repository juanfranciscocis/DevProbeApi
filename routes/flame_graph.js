const express = require('express');
const router = express.Router();

const {get_flame_graph} = require('../controllers/get_flame_graph');

router.get('/', get_flame_graph);


module.exports = router;