
const express = require('express');
const router = express.Router();

const { get_github_repo } = require('../controllers/github_repo/get_github_repo');


router
    .get('/', get_github_repo)

module.exports = router;
