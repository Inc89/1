import { requireAdmin } from "@/lib/auth";
import { db, PLANS, isActive } from "@/lib/db";
import { addSubscriber, extend, setPlan, toggleBlock, removeSubscriber, logout } from "./actions";

export const dynamic = "force-dynamic";

const fmt = (d) => (d ? new Date(d).toLocaleDateString("ru-RU") : "бессрочно");

export default async function Home({ searchParams }) {
  await requireAdmin();
  const { q = "", plan = "" } = await searchParams;

  const { data: all = [], error } = await db()
    .from("subscribers")
    .select("*")
    .order("created_at", { ascending: false });

  const needle = q.toLowerCase();
  const rows = (all ?? []).filter(
    (s) =>
      (!plan || s.plan === plan) &&
      (!needle || [s.telegram_id, s.email, s.name].some((v) => v?.toLowerCase().includes(needle)))
  );
  const active = (all ?? []).filter(isActive);
  const soon = active.filter((s) => s.expires_at && new Date(s.expires_at) - Date.now() < 3 * 864e5);

  return (
    <main>
      <header>
        <h1>Контент завод — подписки</h1>
        <form action={logout}><button>Выйти</button></form>
      </header>

      {error && <p className="card error">Ошибка базы: {error.message}</p>}

      <div className="stats">
        <div className="card stat"><b>{all?.length ?? 0}</b><span>всего пользователей</span></div>
        <div className="card stat"><b>{active.length}</b><span>активных подписок</span></div>
        {PLANS.filter((p) => p !== "free").map((p) => (
          <div key={p} className="card stat"><b>{active.filter((s) => s.plan === p).length}</b><span>тариф {p}</span></div>
        ))}
        <div className="card stat"><b>{soon.length}</b><span>истекают за 3 дня</span></div>
      </div>

      <div className="card">
        <form action={addSubscriber} className="row">
          <strong>Добавить:</strong>
          <input name="telegram_id" placeholder="Telegram ID" />
          <input name="email" type="email" placeholder="Email" />
          <input name="name" placeholder="Имя" />
          <select name="plan">{PLANS.map((p) => <option key={p}>{p}</option>)}</select>
          <input name="days" type="number" min="0" defaultValue="30" style={{ width: 80 }} title="дней" />
          <span className="muted">дней</span>
          <button className="primary">Добавить</button>
        </form>
      </div>

      <div className="card">
        <form className="row" style={{ marginBottom: 12 }}>
          <input name="q" defaultValue={q} placeholder="Поиск: ID, email, имя" />
          <select name="plan" defaultValue={plan}>
            <option value="">все тарифы</option>
            {PLANS.map((p) => <option key={p}>{p}</option>)}
          </select>
          <button>Найти</button>
        </form>

        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Пользователь</th><th>Тариф</th><th>Статус</th><th>До</th><th>Действия</th></tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id}>
                  <td>
                    {s.name || "—"}
                    <div className="muted">{[s.telegram_id && `tg: ${s.telegram_id}`, s.email].filter(Boolean).join(" · ")}</div>
                  </td>
                  <td>
                    <form action={setPlan} className="row">
                      <input type="hidden" name="id" value={s.id} />
                      <select name="plan" defaultValue={s.plan}>{PLANS.map((p) => <option key={p}>{p}</option>)}</select>
                      <button>✓</button>
                    </form>
                  </td>
                  <td>
                    <span className={`badge ${isActive(s) ? "on" : "off"}`}>
                      {s.status === "blocked" ? "заблокирован" : isActive(s) ? "активна" : "истекла"}
                    </span>
                  </td>
                  <td>{fmt(s.expires_at)}</td>
                  <td className="actions">
                    {[30, 90, 365].map((d) => (
                      <form key={d} action={extend}>
                        <input type="hidden" name="id" value={s.id} />
                        <input type="hidden" name="days" value={d} />
                        <button>+{d} дн</button>
                      </form>
                    ))}
                    <form action={toggleBlock}>
                      <input type="hidden" name="id" value={s.id} />
                      <input type="hidden" name="status" value={s.status} />
                      <button>{s.status === "active" ? "Заблокировать" : "Разблокировать"}</button>
                    </form>
                    <form action={removeSubscriber}>
                      <input type="hidden" name="id" value={s.id} />
                      <button className="danger">Удалить</button>
                    </form>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={5} className="muted">Пользователей нет</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
