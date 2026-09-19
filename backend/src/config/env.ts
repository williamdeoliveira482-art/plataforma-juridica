import "dotenv/config";

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${name}`);
  }
  return value;
}

export const env = {
  port: parseInt(process.env.PORT ?? "4000", 10),
  databaseUrl: required("DATABASE_URL"),
  jwtSecret: required("JWT_SECRET", "dev-secret-change-me"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "8h",
  clientPortalJwtSecret: required("CLIENT_PORTAL_JWT_SECRET", "dev-portal-secret-change-me"),
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:5173",
  storagePath: process.env.STORAGE_PATH ?? "./storage/documents",
  // IA: se ausente, o módulo de IA responde com status "não configurado" em vez de simular respostas.
  aiApiKey: process.env.AI_API_KEY ?? "",
};
