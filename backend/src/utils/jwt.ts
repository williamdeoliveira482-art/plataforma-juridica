import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface UserTokenPayload {
  sub: string;
  role: string;
  officeId: string;
  kind: "user";
}

export interface ClientTokenPayload {
  sub: string;
  clientId: string;
  kind: "client";
}

export function signUserToken(payload: UserTokenPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

export function verifyUserToken(token: string): UserTokenPayload {
  return jwt.verify(token, env.jwtSecret) as UserTokenPayload;
}

export function signClientToken(payload: ClientTokenPayload): string {
  return jwt.sign(payload, env.clientPortalJwtSecret, { expiresIn: "8h" });
}

export function verifyClientToken(token: string): ClientTokenPayload {
  return jwt.verify(token, env.clientPortalJwtSecret) as ClientTokenPayload;
}
