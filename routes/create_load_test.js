
const express = require('express');
const router = express.Router();

const { post_create_load_test } = require('../controllers/load_test/post_create_load_test');


router
    .post('/', post_create_load_test)

module.exports = router;
