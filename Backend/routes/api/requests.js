const express = require('express');
const router = express.Router();
const requestsController = require('../../controllers/requestsController.js');

router.route('/')
    .get(requestsController.getRequests)
    .post(requestsController.postRequest)
    .put(requestsController.putRequest);

module.exports = router;