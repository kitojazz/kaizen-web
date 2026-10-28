import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "kaizen_admin";
const MAX_AGE_SECONDS = 60 * 60 * 8;

type SessionPayload = {
  email: string;
  exp: number;
};

export type AdminSession = {
  email: string;
};

function secret() {
  return process.env.AUTH_SECRET || "kaizen-development-secret";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function encodeToken(payload: SessionPayload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

function decodeToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  if (!safeEqual(signature, sign(body))) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as SessionPayload;
    if (!payload?.email || typeof payload.exp !== "number") return null;
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function validateCredentials(email: string, password: string) {
  const expectedEmail = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const expectedPassword = process.env.ADMIN_PASSWORD ?? "";
  if (!expectedEmail || !expectedPassword) return false;

  const emailOk = safeEqual(email.trim().toLowerCase(), expectedEmail);
  const passwordOk = safeEqual(password, expectedPassword);
  return emailOk && passwordOk;
}

export async function startSession(email: string) {
  const payload: SessionPayload = {
    email: email.trim().toLowerCase(),
    exp: Date.now() + MAX_AGE_SECONDS * 1000,
  };

  cookies().set({
    name: COOKIE_NAME,
    value: encodeToken(payload),
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
    secure: process.env.NODE_ENV === "production",
  });
}

export function endSession() {
  cookies().set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function getSession(): AdminSession | null {
  const payload = decodeToken(cookies().get(COOKIE_NAME)?.value);
  return payload ? { email: payload.email } : null;
}

export function isAdmin() {
  return getSession() !== null;
}

export function requireAdmin(): AdminSession {
  const session = getSession();
  if (!session) redirect("/admin/login");
  return session;
}

export function assertAdmin(): AdminSession {
  return requireAdmin();
}
