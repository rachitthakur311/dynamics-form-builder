const Form = require('../models/formTitleSchema');
const Field = require('../models/formInfoSchema');
const Submission = require('../models/submissionSchema')
const { Types } = require('mongoose');
const { options } = require('../routes/formTitleRoutes');

const createForm = async function (req, res) {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        status: false,
        message: "Title is required"
      });
    }

    const newForm = await Form.create({
      title: title.trim(),
      description: description?.trim()
    });

    return res.status(201).json({
      status: true,
      message: "Form created successfully",
      data: newForm
    });

  } catch (error) {
    console.error("Create Form Error:", error);

    return res.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
};

const listFormsAdmin = async (req, res) => {
  try {
    const forms = await Form.find().sort({ createdAt: -1 });

    return res.status(200).json({
      status: true,
      message: "Forms fetched successfully",
      data: forms
    });

  } catch (error) {
    console.log("List Forms Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
};

const createField = async function (req, res) {
  try {
    const { formId } = req.params;
    const {
      label,
      type,
      name,
      required,
      options,
      validation,
      visibility
    } = req.body

    const formExists = await Form.findById(formId);
    if (!formExists) {
      return res.status(404).json({
        status: false,
        message: "Form not found",
      });
    }


    if (!label || !name || !type) {
      return res.status(400).json({
        status: false,
        message: "label, name and type are required fields",
      });
    }

    const typesRequiringOptions = ["radio", "select", "checkbox"];
    if (typesRequiringOptions.includes(type) && (!options || options.length === 0)) {
      return res.status(400).json({
        status: false,
        message: "Options are required for radio/select/checkbox fields",
      });
    }

    const lastField = await Field.findOne({ formId }).sort({ order: -1 });
    const nextOrder = lastField ? lastField.order + 1 : 1;

    const newField = await Field.create({
      formId,
      label,
      name,
      type,
      required: required ?? false,
      options,
      validation,
      visibility,
      order: nextOrder,
    });

    return res.status(201).json({
      status: true,
      message: "Field created successfully",
      data: newField,
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        status: false,
        message: `Field name "${req.body.name}" already exists in this form. Please choose a different name.`
      });
    }
    console.error("Create Field Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

const updateField = async (req, res) => {
  try {
    const { fieldId } = req.params;
    const updates = req.body;

    const field = await Field.findById(fieldId);
    if (!field) {
      return res.status(404).json({
        status: false,
        message: "Field not found"
      });
    }

    Object.assign(field, updates);
    await field.save();

    return res.status(200).json({
      status: true,
      message: "Field updated successfully",
      data: field
    });
  } catch (error) {
    console.log("Update Field Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
};

const deleteField = async (req, res) => {
  try {
    const { fieldId } = req.params;

    const field = await Field.findByIdAndDelete(fieldId);
    if (!field) {
      return res.status(404).json({
        status: false,
        message: "Field not found"
      });
    }

    return res.status(200).json({
      status: true,
      message: "Field deleted successfully"
    });
  } catch (error) {
    console.log("Delete Field Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
};

const reorderFields = async (req, res) => {
  try {
    const { formId } = req.params;
    const { fieldsOrder } = req.body; // [{ fieldId, order }]

    if (!Array.isArray(fieldsOrder)) {
      return res.status(400).json({
        status: false,
        message: "Invalid input format. Expected array of fieldId/order pairs."
      });
    }

    const bulkOps = fieldsOrder.map(({ fieldId, order }) => ({
      updateOne: {
        filter: { _id: fieldId, formId },
        update: { $set: { order } }
      }
    }));

    await Field.bulkWrite(bulkOps);

    return res.status(200).json({
      status: true,
      message: "Fields reordered successfully"
    });
  } catch (error) {
    console.log("Reorder Fields Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
};

const getFieldsByFormId = async (req, res) => {
  try {
    const { formId } = req.query;
    const fields = await Field.find({ formId }).sort({ order: 1 });

    return res.status(200).json({
      status: true,
      message: "Fields fetched successfully",
      data: fields
    });

  } catch (error) {
    console.log("Get Fields Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
};

const updateForm = async (req, res) => {
  try {
    const { formId } = req.params;
    const { title, description, isArchive } = req.body;

    const updatedForm = await Form.findByIdAndUpdate(
      formId,
      {
        ...(title && { title }),
        ...(description && { description }),
        ...(isArchive !== undefined && { isArchive })
      },
      { new: true, runValidators: true }
    );

    if (!updatedForm) {
      return res.status(404).json({
        status: false,
        message: "Form not found"
      });
    }

    return res.status(200).json({
      status: true,
      message: "Form updated successfully",
      data: updatedForm
    });
  } catch (error) {
    console.log("Update Form Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
};

const deleteForm = async (req, res) => {
  try {
    const { formId } = req.query;
    const hasSubmissions = await Submission.exists({ formId });
    if (hasSubmissions) {
      return res.status(400).json({
        status: false,
        message: "Cannot delete form because submissions exist. Consider archiving instead."
      });
    }
    await Field.deleteMany({ formId });
    const deletedForm = await Form.findByIdAndDelete(formId);

    if (!deletedForm) {
      return res.status(404).json({
        status: false,
        message: "Form not found"
      });
    }

    return res.status(200).json({
      status: true,
      message: "Form deleted successfully"
    });

  } catch (error) {
    console.log("Delete Form Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
};


module.exports = {
  createForm,
  listFormsAdmin,
  createField,
  updateField,
  deleteField,
  reorderFields,
  getFieldsByFormId,
  updateForm,
  deleteForm
}