const express = require('express');
const router = express.Router();
const getDocumentOptions = require('../../controllers/getDocumentOptions.js');
const removeDocument = require('../../controllers/removeDocument.js');
const addDocument = require('../../controllers/addDocumentOption');
const editFee = require('../../controllers/editDocumentFee.js');

router.route('/')
    .get(getDocumentOptions.documentOptions)
    .post(addDocument.addDocumentOption)
    .put(editFee.editDocumentFee)
    .delete(removeDocument.removeDocument);

module.exports = router;