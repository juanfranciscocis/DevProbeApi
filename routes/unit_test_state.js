
const express = require('express');
const router = express.Router();

const { post_unit_test_state } = require('../controllers/software_tests/post_unit_test_state');


router
    .post('/', post_unit_test_state)

module.exports = router;
