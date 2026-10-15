-- Выполните в Supabase → SQL Editor
create table if not exists subscribers (
  id          bigint generated always as identity primary key,
  telegram_id text unique,
  email       text unique,
  name        text,
  plan        text not null default 'free',      -- free | basic | pro
  status      text not null default 'active',    -- active | blocked
  expires_at  timestamptz,                       -- null = без срока
  notes       text,
  created_at  timestamptz not null default now()
);

-- Доступ только через service_role ключ сервера
alter table subscribers enable row level security;
