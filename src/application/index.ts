import { handleErrorsMiddleware } from "./middlewares";
import { options } from "./swagger";

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
dotenv.config();

const specs = swaggerJsdoc(options);
const app = express();

app.use(express.json());
app.use(cors());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

app.use("/api/v1", require("../application/routes"));

app.use(handleErrorsMiddleware);

module.exports = app;
