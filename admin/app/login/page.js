import { redirect } from "next/navigation";
import { checkPassword, startSession } from "@/lib/auth";

async function login(formData) {
  "use server";
  if (!checkPassword(String(formData.get("password") ?? ""))) redirect("/login?error=1");
  await startSession();
  redirect("/");
}

export default async function LoginPage({ searchParams }) {
  const { error } = await searchParams;
  return (
    <main>
      <form action={login} className="card login">
        <h1>Вход в админку</h1>
        <input type="password" name="password" placeholder="Пароль" required autoFocus />
        {error && <p className="error">Неверный пароль</p>}
        <button className="primary">Войти</button>
      </form>
    </main>
  );
}
