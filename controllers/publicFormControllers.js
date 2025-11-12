const Form = require("../models/formSchema");
const Field = require("../models/formInformationSchema");

const listFormsPublic = async (req, res) => {
  try {
    const forms = await Form.find({ isArchive: false }).select("_id title description createdAt");
    return res.status(200).json({
      status: true,
      message: "Forms fetched successfully",
      data: forms
    });
  } catch (error) {
    console.log("List Forms Public Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
};

const getFormDefinition = async (req, res) => {
  try {
    const { formId } = req.params;

    const form = await Form.findById(formId);
    if (!form || form.isArchive) {
      return res.status(404).json({ status: false, message: "Form not found" });
    }

    const fields = await Field.find({ formId }).sort({ order: 1 });

    return res.status(200).json({
      status: true,
      message: "Form definition fetched successfully",
      data: {
        form,
        fields
      }
    });
  } catch (error) {
    console.log("Get Form Definition Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
};

module.exports = { listFormsPublic, getFormDefinition };
