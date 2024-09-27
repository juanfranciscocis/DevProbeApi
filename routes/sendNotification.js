
const express = require('express');
const router = express.Router();

const { post_notification } = require('../controllers/notifications/post_notification');


router
    .post('/', post_notification)

module.exports = router;
