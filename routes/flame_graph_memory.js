const express = require('express');
const router = express.Router();

const { get_flame_graph } = require('../controllers/flame_graph_memory/get_flame_graph_memory');
const {post_flame_graph}  = require('../controllers/flame_graph_memory/post_flame_graph_memory');
router
    .get('/', get_flame_graph)
    .post('/', post_flame_graph); // Use the correct function as a callback

module.exports = router;