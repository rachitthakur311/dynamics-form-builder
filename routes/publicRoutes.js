const express = require("express");

const router = express.Router();

const publicFormController = require('../controllers/publicFormControllers');



router.get("/users/forms", publicFormController.listFormsPublic);
router.get("/user/forms/:formId", publicFormController.getFormDefinition);


module.exports = router;