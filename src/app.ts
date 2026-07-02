import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import routes from "./routes";
import swaggerDocument from "./swagger.json";
import { errorHandler } from "./shared/middleware/error.middleware";
import { getPublicAssetBaseUrl, getUploadDir } from "./shared/uploads/upload.service";
import { startPublishJobScheduler } from "./shared/scheduler/publish-jobs.service";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const publicAssetBaseUrl = getPublicAssetBaseUrl();
if (publicAssetBaseUrl.startsWith("/")) {
  app.use(publicAssetBaseUrl, express.static(getUploadDir()));
}

startPublishJobScheduler();

// Endpoint untuk UI Swagger menggunakan file JSON statis
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/", routes);

// Global error handling middleware (must be registered last)
app.use(errorHandler);

export default app;
