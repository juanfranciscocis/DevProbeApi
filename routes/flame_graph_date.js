const express = require('express');
const router = express.Router();

const { get_flame_graph_date } = require('../controllers/flame_graph/get_flame_graph_date');


router
    .get('/', get_flame_graph_date)

module.exports = router;