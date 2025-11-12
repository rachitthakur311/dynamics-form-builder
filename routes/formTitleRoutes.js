const express = require("express");


const router = express.Router();

const queryFormController = require("../controllers/queryFormController");
const authAdmin = require('../middlewares/adminMiddleware')

router.post('/createQueryForm-title', queryFormController.createForm);
router.get("/adminForms", authAdmin, queryFormController.listFormsAdmin);
router.put("/adminUpdateForm", authAdmin, queryFormController.updateForm);
router.delete("/admin/fields/:fieldId", authAdmin, queryFormController.deleteField);
router.put("/admin/forms/:formId/fields/reorder", authAdmin, queryFormController.reorderFields);
router.post('/forms/:formId/fields', queryFormController.createField);
router.patch("/admin/fields/:fieldId", authAdmin, queryFormController.updateField);
router.get('/formsFields', queryFormController.getFieldsByFormId);
router.delete("/adminDeleteform", authAdmin, queryFormController.deleteForm);


module.exports = router;