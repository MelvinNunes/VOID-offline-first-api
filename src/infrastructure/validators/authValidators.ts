export const loginValidator = {
  email: {
    exists: {
      errorMessage: "Please enter your email address",
    },
    isEmail: {
      errorMessage: "Please enter a valid email address",
    },
  },
  password: {
    exists: {
      errorMessage: "Please enter your password",
    },
  },
};

export const registerValidator = {
  email: {
    optional: false,
    isEmail: {
      errorMessage: "Please enter a valid email address",
    },
  },
  password: {
    optional: false,
    errorMessage: "Please enter a valid password",
    isLength: {
      errorMessage: "Password must be at least 5 characters",
      options: {
        min: 5,
      },
    },
  },
  firstName: {
    optional: false,
    errorMessage: "Please enter your first name",
    isString: {
      errorMessage: "Insert a valid last name",
    },
  },
  lastName: {
    optional: false,
    errorMessage: "Please enter your last name",
    isString: {
      errorMessage: "Insert a valid last name",
    },
  },
  phoneNumber: {
    optional: false,
    errorMessage: "Please enter your phone number",
    isNumeric: {
      errorMessage: "Please enter a valid phone number",
    },
  },
  identificationNumber: {
    optional: false,
    errorMessage: "Please enter your identification number",
    isString: {
      errorMessage: "Please enter a valid identification number",
    },
  },
};
