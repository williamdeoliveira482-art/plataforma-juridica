import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import * as documentService from "../services/document.service";
import { AppError } from "../utils/AppError";

export async function list(req: AuthenticatedRequest, res: Response) {
  const { clientId, processId } = req.query as Record<string, string>;
  res.json(await documentService.listDocuments(req.user!.officeId, { clientId, processId }));
}

export async function upload(req: AuthenticatedRequest, res: Response) {
  if (!req.file) throw new AppError("Nenhum arquivo enviado.", 400);
  const { name, categoryId, clientId, processId } = req.body;
  const doc = await documentService.createDocument(req.user!.officeId, req.user!.id, req.file, {
    name,
    categoryId,
    clientId,
    processId,
  });
  res.status(201).json(doc);
}

export async function download(req: AuthenticatedRequest, res: Response) {
  const filePath = await documentService.getDocumentFilePath(req.params.id, req.user!.officeId);
  if (!filePath) throw new AppError("Documento não encontrado.", 404);
  res.download(filePath);
}

export async function remove(req: AuthenticatedRequest, res: Response) {
  await documentService.deleteDocument(req.params.id, req.user!.officeId);
  res.status(204).send();
}

export async function categories(_req: AuthenticatedRequest, res: Response) {
  res.json(await documentService.listCategories());
}
