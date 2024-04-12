export const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Documentation API with Swagger",
      version: "0.1.0",
      description: "This is documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Documentation",
        url: "https://url",
        email: "info@email.com",
      },
    },
    servers: [
      {
        url: "http://localhost:8000",
      },
    ],
  },
  apis: ["../controller/*.ts"],
};
