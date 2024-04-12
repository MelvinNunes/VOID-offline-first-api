export const postCreationValidator = {
  posts: {
    isArray: {
      errorMessage: "Please insert the array of posts",
      bail: true,
      options: {
        min: 1,
      },
    },
  },
};

export const postImageValidator = {
  is_post: {
    isBoolean: {
      errorMessage: "Please insert a valid error message",
    },
    optional: false,
  },
};

export const postUpdateValidator = {
  title: {
    optional: true,
  },
  content: {
    optional: true,
  },
  category: {
    isNumeric: {
      errorMessage: "Please enter a valid category int",
    },
    optional: true,
  },
};
