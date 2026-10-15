import { timingSafeEqual } from "node:crypto";
import { db, isActive } from "@/lib/db";

// API для приложения «Контент завод».
// Заголовок: x-api-key: <APP_API_KEY>
//   GET  /api/subscription?telegram_id=123  (или ?email=...) → статус подписки
//   POST /api/subscription {telegram_id|email, name} → регистрирует пользователя (тариф free)

function authorized(req) {
  const key = Buffer.from(req.headers.get("x-api-key") ?? "");
  const expected = Buffer.from(process.env.APP_API_KEY ?? "");
  return expected.length > 0 && key.length === expected.length && timingSafeEqual(key, expected);
}

function lookup(params) {
  const telegram_id = params.telegram_id ? String(params.telegram_id) : null;
  const email = params.email ? String(params.email) : null;
  if (telegram_id) return ["telegram_id", telegram_id];
  if (email) return ["email", email];
  return null;
}

export async function GET(req) {
  if (!authorized(req)) return Response.json({ error: "unauthorized" }, { status: 401 });
  const by = lookup(Object.fromEntries(new URL(req.url).searchParams));
  if (!by) return Response.json({ error: "telegram_id or email required" }, { status: 400 });

  const { data } = await db().from("subscribers").select("*").eq(by[0], by[1]).maybeSingle();
  if (!data) return Response.json({ exists: false, active: false, plan: null });
  return Response.json({ exists: true, active: isActive(data), plan: data.plan, status: data.status, expires_at: data.expires_at });
}

export async function POST(req) {
  if (!authorized(req)) return Response.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const by = lookup(body);
  if (!by) return Response.json({ error: "telegram_id or email required" }, { status: 400 });

  const { data, error } = await db()
    .from("subscribers")
    .upsert({ [by[0]]: by[1], name: body.name ?? null }, { onConflict: by[0], ignoreDuplicates: true })
    .select()
    .maybeSingle();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true, created: Boolean(data) });
}
