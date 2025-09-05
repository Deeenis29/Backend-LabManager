import express from "express";
import cors from "cors";
import helmet from "helmet";
import router  from "@routes/index";
import {authRateLimiter} from "@middlewares/rate-limit.middleware";

const app = express();

// Middlewares globales
app.use(cors());
app.use(helmet());
app.use(express.json());

// Montamos todas las rutas bajo /api/v1
app.use("/api/v1", router, authRateLimiter);

export default app;