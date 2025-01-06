const express = require('express');
const router = express.Router();
const documentsController = require('../../controllers/documentsController.js');

router.route('/')
    .get(documentsController.getDocumentOptions)
    .post(documentsController.postDocumentOption)
    .put(documentsController.putDocumentOption)
    .delete(documentsController.deleteDocumentOption);

module.exports = router;