"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, endSession } from "@/lib/auth";
import { db, PLANS } from "@/lib/db";

const clean = (v) => String(v ?? "").trim() || null;

async function update(id, fields) {
  await requireAdmin();
  const { error } = await db().from("subscribers").update(fields).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
}

export async function addSubscriber(formData) {
  await requireAdmin();
  const days = Number(formData.get("days")) || 0;
  const plan = PLANS.includes(formData.get("plan")) ? formData.get("plan") : "free";
  const { error } = await db().from("subscribers").insert({
    telegram_id: clean(formData.get("telegram_id")),
    email: clean(formData.get("email")),
    name: clean(formData.get("name")),
    plan,
    expires_at: days > 0 ? new Date(Date.now() + days * 864e5).toISOString() : null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/");
}

// Продление считается от текущей даты окончания, если она ещё не прошла
export async function extend(formData) {
  await requireAdmin();
  const id = formData.get("id");
  const days = Number(formData.get("days"));
  const { data } = await db().from("subscribers").select("expires_at").eq("id", id).single();
  const base = Math.max(Date.now(), data?.expires_at ? new Date(data.expires_at).getTime() : 0);
  await update(id, { expires_at: new Date(base + days * 864e5).toISOString(), status: "active" });
}

export async function setPlan(formData) {
  const plan = formData.get("plan");
  if (!PLANS.includes(plan)) return;
  await update(formData.get("id"), { plan });
}

export async function toggleBlock(formData) {
  await update(formData.get("id"), { status: formData.get("status") === "active" ? "blocked" : "active" });
}

export async function removeSubscriber(formData) {
  await requireAdmin();
  await db().from("subscribers").delete().eq("id", formData.get("id"));
  revalidatePath("/");
}

export async function logout() {
  await endSession();
  redirect("/login");
}
