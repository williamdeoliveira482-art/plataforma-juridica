import { env } from "../config/env";
import { prisma } from "../lib/prisma";

/**
 * Assistente Jurídico Inteligente — esqueleto de integração.
 * Sem chave de API configurada, a IA não simula respostas: retorna
 * status explícito de "não configurado", conforme exigido no briefing.
 */
export async function requestAIAssistance(params: {
  officeId: string;
  userId: string;
  clientId?: string;
  processId?: string;
  kind: string;
  prompt: string;
}) {
  if (!env.aiApiKey) {
    await prisma.aiInteraction.create({
      data: {
        officeId: params.officeId,
        userId: params.userId,
        clientId: params.clientId,
        processId: params.processId,
        kind: params.kind,
        prompt: params.prompt,
        response: null,
        reviewedByHuman: false,
      },
    });
    return {
      configured: false,
      message:
        "O Assistente Jurídico Inteligente ainda não está configurado. Configure uma chave de API de IA (variável AI_API_KEY) para habilitar este módulo.",
    };
  }

  // Ponto de integração futuro com OpenAI/Anthropic/etc.
  // A resposta gerada deve sempre ser tratada como rascunho a revisar.
  throw new Error("Integração de IA não implementada nesta fase.");
}

export async function listAIInteractions(officeId: string) {
  return prisma.aiInteraction.findMany({ where: { officeId }, orderBy: { createdAt: "desc" } });
}
