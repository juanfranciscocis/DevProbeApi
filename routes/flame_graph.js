const express = require('express');
const router = express.Router();

const { get_flame_graph } = require('../controllers/flame_graph_cpu/get_flame_graph');
const {post_flame_graph}  = require('../controllers/flame_graph_cpu/post_flame_graph');
router
    .get('/', get_flame_graph)
    .post('/', post_flame_graph); // Use the correct function as a callback

module.exports = router;