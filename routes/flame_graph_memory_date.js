const express = require('express');
const router = express.Router();

const { get_flame_graph_date } = require('../controllers/flame_graph_memory/get_flame_graph_memory_date');


router
    .get('/', get_flame_graph_date)
    .post('/', get_flame_graph_date); // Use the correct function as a callback

module.exports = router;