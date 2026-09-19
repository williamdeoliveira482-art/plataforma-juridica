import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { errorMiddleware, notFoundMiddleware } from "./middlewares/error.middleware";

import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/users.routes";
import clientsRoutes from "./routes/clients.routes";
import processesRoutes from "./routes/processes.routes";
import tasksRoutes from "./routes/tasks.routes";
import eventsRoutes from "./routes/events.routes";
import documentsRoutes from "./routes/documents.routes";
import financialRoutes from "./routes/financial.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import interactionsRoutes from "./routes/interactions.routes";
import clientPortalRoutes from "./routes/clientPortal.routes";
import aiRoutes from "./routes/ai.routes";

export const app = express();

app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/processes", processesRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/documents", documentsRoutes);
app.use("/api/financial", financialRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/attendance", interactionsRoutes);
app.use("/api/client-portal", clientPortalRoutes);
app.use("/api/ai", aiRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);
