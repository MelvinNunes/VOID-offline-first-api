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
