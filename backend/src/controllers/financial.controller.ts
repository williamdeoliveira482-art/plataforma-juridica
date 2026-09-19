import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { financialEntrySchema, financialEntryUpdateSchema, paymentSchema } from "../validators/financial.schema";
import * as financialService from "../services/financial.service";

export async function list(req: AuthenticatedRequest, res: Response) {
  const status = req.query.status as string | undefined;
  res.json(await financialService.listFinancialEntries(req.user!.officeId, status));
}

export async function create(req: AuthenticatedRequest, res: Response) {
  const data = financialEntrySchema.parse(req.body);
  res.status(201).json(await financialService.createFinancialEntry(req.user!.officeId, data));
}

export async function update(req: AuthenticatedRequest, res: Response) {
  const data = financialEntryUpdateSchema.parse(req.body);
  res.json(await financialService.updateFinancialEntry(req.params.id, req.user!.officeId, data));
}

export async function remove(req: AuthenticatedRequest, res: Response) {
  await financialService.deleteFinancialEntry(req.params.id, req.user!.officeId);
  res.status(204).send();
}

export async function pay(req: AuthenticatedRequest, res: Response) {
  const data = paymentSchema.parse(req.body);
  res.status(201).json(await financialService.registerPayment(req.params.id, data.amount, data.method));
}

export async function summary(req: AuthenticatedRequest, res: Response) {
  res.json(await financialService.financialSummary(req.user!.officeId));
}
