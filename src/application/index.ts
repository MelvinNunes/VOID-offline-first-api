import { handleErrorsMiddleware } from "./middlewares";

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../../docs/swagger.json");
const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/v1", require("../application/routes"));

app.use(handleErrorsMiddleware);

module.exports = app;
