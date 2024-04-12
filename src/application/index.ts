import i18nextConfig from "../../src/infrastructure/config/internationalization";
import { handleErrorsMiddleware } from "./middlewares";

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../../docs/swagger.json");

const i18nextMiddleware = require("i18next-http-middleware");

const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());

app.use(i18nextMiddleware.handle(i18nextConfig));

app.use("/uploads", express.static("uploads"));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/v1", require("../application/routes"));

app.use(handleErrorsMiddleware);

module.exports = app;
