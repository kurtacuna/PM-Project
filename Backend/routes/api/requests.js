const express = require('express');
const router = express.Router();
const requestsController = require('../../controllers/requestsController.js');

router.route('/')
    .get(requestsController.getRequests)
    .post(requestsController.postRequest)
    .put(requestsController.putRequest);

router.put('/approve', requestsController.approveFee)
router.put('/reject', requestsController.rejectFee)

module.exports = router;