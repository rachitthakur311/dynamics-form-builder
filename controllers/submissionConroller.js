const Field = require('../models/formInfoSchema');
const Form = require('../models/formTitleSchema');
const Submission = require('../models/submissionSchema');

const submitForm = async (req, res) => {
  try {
    const { formId } = req.params;
    const { answers } = req.body;

    const form = await Form.findById(formId);
    if (!form || form.isArchive) {
      return res.status(404).json({ status: false, message: "Form not found" });
    }

    const fields = await Field.find({ formId }).sort({ order: 1 });

    const fieldByName = new Map(fields.map(f => [f.name, f]));
    const visibilityRules = new Map(
      fields.map(f => [f.name, f.visibility || null])
    );

    let validationErrors = {};
    let sanitizedAnswers = {};

    for (const field of fields) {
      const { name, type, required, options, validation } = field;
      const fieldValue = answers?.[name];

      if (field.visibility?.parentFieldId) {
        const parentField = fields.find(f => String(f._id) === String(field.visibility.parentFieldId));
        const parentAnswer = answers?.[parentField.name];

        if (parentAnswer !== field.visibility.showWhenOptionValue) {
          continue;
        }
      }
      if (required && (fieldValue === undefined || fieldValue === "")) {
        validationErrors[name] = "This field is required.";
        continue;
      }

      if (type === "number" && fieldValue !== undefined) {
        if (isNaN(fieldValue)) {
          validationErrors[name] = "Value must be a number.";
          continue;
        }
        let num = Number(fieldValue);
        if (validation?.min !== undefined && num < validation.min) {
          validationErrors[name] = `Minimum value is ${validation.min}.`;
          continue;
        }
        if (validation?.max !== undefined && num > validation.max) {
          validationErrors[name] = `Maximum value is ${validation.max}.`;
          continue;
        }
        sanitizedAnswers[name] = num;
        continue;
      }

      if ((type === "radio" || type === "select") && fieldValue !== undefined) {
        const allowedValues = (options || []).map(o => o.value);
        if (!allowedValues.includes(fieldValue)) {
          validationErrors[name] = "Invalid option selected.";
          continue;
        }
        sanitizedAnswers[name] = fieldValue;
        continue;
      }

      if (type === "text" || type === "textarea") {
        let val = String(fieldValue || "").trim();
        if (validation?.min && val.length < validation.min) {
          validationErrors[name] = `Minimum length is ${validation.min}.`;
          continue;
        }
        if (validation?.max && val.length > validation.max) {
          validationErrors[name] = `Maximum length is ${validation.max}.`;
          continue;
        }
        if (validation?.regex) {
          const regex = new RegExp(validation.regex);
          if (!regex.test(val)) {
            validationErrors[name] = "Invalid format.";
            continue;
          }
        }
        sanitizedAnswers[name] = val;
        continue;
      }

      if (fieldValue !== undefined) sanitizedAnswers[name] = fieldValue;
    }

    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({
        status: false,
        message: "Validation failed",
        errors: validationErrors
      });
    }

    await Submission.create({
      formId,
      answers: sanitizedAnswers,
      meta: {
        ip: req.ip,
        userAgent: req.headers["user-agent"]
      }
    });

    return res.status(201).json({
      status: true,
      message: "Form submitted successfully"
    });

  } catch (error) {
    console.log("Submit Form Error:", error);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};


const listSubmissions = async (req, res) => {
  try {
    const { formId } = req.params;
    const { page = 1, limit = 10 } = req.query; // optional pagination
    const skip = (page - 1) * limit;

    // Fetch submissions for the given formId
    const submissions = await Submission.find({ formId })
      .sort({ createdAt: -1 })  // newest first
      .skip(Number(skip))
      .limit(Number(limit));

    const total = await Submission.countDocuments({ formId });
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      status: true,
      message: "Submissions fetched successfully",
      pagination: {
        total,
        page: Number(page),
        totalPages
      },
      data: submissions
    });
  } catch (error) {
    console.log("List Submissions Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
};

module.exports = {
  submitForm,
  listSubmissions
}