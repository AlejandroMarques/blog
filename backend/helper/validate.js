const validator = require("validator");

const validateData = (params) => {
  try {
    const validateTitle =
      !validator.isEmpty(params.title) &&
      validator.isLength(params.title, { min: 5, max: 100 });
    const validateContent = !validator.isEmpty(params.content);
    if (!validateTitle || !validateContent) throw new Error("Invalid data");
    return true;
  } catch (error) {
    throw new Error("Invalid data");
  }
};

module.exports = {
  validateData,
};
