const express = require("express");


const router = express.Router();

const queryFormController = require("../controllers/queryFormController");
const authAdmin = require('../middlewares/adminMiddleware')

router.post('/createQueryForm-title', queryFormController.createForm);
router.post('/forms/:formId/fields', queryFormController.createField);
router.get("/admin/Forms", authAdmin, queryFormController.listFormsAdmin);
router.put("/admin/UpdateForm", authAdmin, queryFormController.updateForm);
router.delete("/admin/fields/:fieldId", authAdmin, queryFormController.deleteField);
router.put("/admin/forms/:formId/fields/reorder", authAdmin, queryFormController.reorderFields);
router.patch("/admin/fields/:fieldId", authAdmin, queryFormController.updateField);
router.get('/admin/formsFields', authAdmin, queryFormController.getFieldsByFormId);
router.delete("/admin/Deleteform", authAdmin, queryFormController.deleteForm);


module.exports = router;