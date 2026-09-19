import { prisma } from "../lib/prisma";
import fs from "fs";
import path from "path";
import { env } from "../config/env";

export async function listDocuments(officeId: string, filters: { clientId?: string; processId?: string } = {}) {
  return prisma.document.findMany({
    where: {
      officeId,
      ...(filters.clientId ? { clientId: filters.clientId } : {}),
      ...(filters.processId ? { processId: filters.processId } : {}),
    },
    include: { category: true, client: true, process: true, uploadedByUser: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createDocument(
  officeId: string,
  uploadedByUserId: string,
  file: Express.Multer.File,
  data: { name?: string; categoryId?: string; clientId?: string; processId?: string }
) {
  return prisma.document.create({
    data: {
      officeId,
      uploadedByUserId,
      name: data.name ?? file.originalname,
      categoryId: data.categoryId,
      clientId: data.clientId,
      processId: data.processId,
      filePath: file.filename,
    },
  });
}

export async function getDocumentFilePath(id: string, officeId: string) {
  const doc = await prisma.document.findFirst({ where: { id, officeId } });
  if (!doc) return null;
  return path.join(env.storagePath, doc.filePath);
}

export async function deleteDocument(id: string, officeId: string) {
  const doc = await prisma.document.findFirst({ where: { id, officeId } });
  if (!doc) return;
  const filePath = path.join(env.storagePath, doc.filePath);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  await prisma.document.delete({ where: { id } });
}

export async function listCategories() {
  return prisma.documentCategory.findMany({ orderBy: { name: "asc" } });
}
