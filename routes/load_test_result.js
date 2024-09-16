
const express = require('express');
const router = express.Router();

const { get_load_test } = require('../controllers/load_test/get_load_test');


router
    .post('/', get_load_test)

module.exports = router;
