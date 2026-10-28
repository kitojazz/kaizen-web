import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { updateContent } from "@/lib/content";
import { rateLimit } from "@/lib/rate-limit";
import type { Lead } from "@/lib/types";

export const runtime = "nodejs";

function clean(value: unknown, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

export async function POST(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "local";
  const limit = rateLimit(`lead:${ip}`, 5, 10 * 60_000);

  if (!limit.allowed) {
    return NextResponse.json(
      {
        error:
          "Recibimos varios mensajes seguidos. Esperá unos minutos o escribinos por WhatsApp.",
      },
      { status: 429 },
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  if (clean(payload.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(payload.name, 120);
  const email = clean(payload.email, 180);
  const phone = clean(payload.phone, 60);
  const company = clean(payload.company, 160);
  const service = clean(payload.service, 120);
  const message = clean(payload.message, 4000);

  if (name.length < 2) {
    return NextResponse.json(
      { error: "Ingresá tu nombre y apellido." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json(
      { error: "Ingresá un correo electrónico válido." },
      { status: 400 },
    );
  }

  if (message.length < 5) {
    return NextResponse.json(
      { error: "Contanos brevemente en qué podemos ayudarte." },
      { status: 400 },
    );
  }

  const lead: Lead = {
    id: randomUUID(),
    name,
    email,
    phone,
    company,
    service,
    message,
    createdAt: new Date().toISOString(),
    status: "new",
  };

  try {
    await updateContent((content) => {
      content.leads.unshift(lead);
      return content;
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "No pudimos guardar el mensaje. Intentá nuevamente o escribinos por WhatsApp.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      message: "Recibimos tu consulta. Te vamos a responder a la brevedad.",
    },
    { status: 201 },
  );
}
