import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import * as dashboardService from "../services/dashboard.service";

export async function summary(req: AuthenticatedRequest, res: Response) {
  res.json(await dashboardService.getDashboardSummary(req.user!.officeId));
}

export async function charts(req: AuthenticatedRequest, res: Response) {
  res.json(await dashboardService.getDashboardCharts(req.user!.officeId));
}
