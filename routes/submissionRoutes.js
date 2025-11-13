const express = require("express");
const authAdmin = require('../middlewares/adminMiddleware')
// const upload = require("../middlewares/uploadMiddleware");
const router = express.Router();

const submissionController = require('../controllers/submissionConroller');

router.post('/forms/:formId/submit', authAdmin, submissionController.submitForm);
router.get("/forms/:formId/listSubmissions", authAdmin, submissionController.listSubmissions);


module.exports = router;