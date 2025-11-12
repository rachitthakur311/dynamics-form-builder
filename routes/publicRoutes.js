const express = require("express");

const router = express.Router();

const publicFormController = require('../controllers/publicFormControllers');



router.get("/forms", publicFormController.listFormsPublic);
router.get("/forms/:formId", publicFormController.getFormDefinition);


module.exports = router