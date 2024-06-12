const express = require('express');
const { getVendorFiles, uploadVendorFile } = require('../controllers/fileController');

const router = express.Router();

router.get('/vendors', getVendorFiles);
router.post('/upload', uploadVendorFile);

module.exports = router;
