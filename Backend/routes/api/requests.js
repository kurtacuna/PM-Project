const express = require('express');
const router = express.Router();
const getRequests = require('../../controllers/getRequests.js');
const putRequestInDB = require('../../controllers/putRequestInDB.js');
const updateRequest = require('../../controllers/updateRequest.js');

router.route('/')
    .get(getRequests.retrieveRequests)
    .post(putRequestInDB.updateDB)
    .put(updateRequest.updateRequestRemarksAndStatus);


module.exports = router;