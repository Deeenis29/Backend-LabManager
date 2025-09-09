import express from "express";
import cors from "cors";
import helmet from "helmet";
import router from "@modules/routes";

const app = express();

// Middlewares globales
app.use(cors());
app.use(helmet());
app.use(express.json());

// Montamos todas las rutas bajo /api/v1
app.use("/api/v1", router);

export default app;