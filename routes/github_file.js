
const express = require('express');
const router = express.Router();

const { get_github_file } = require('../controllers/github_file/get_github_file');


router
    .get('/', get_github_file)

module.exports = router;
