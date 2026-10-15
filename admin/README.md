# Контент завод — админ-панель подписок

Next.js + Supabase. Разворачивается на Vercel.

## Возможности
- Вход по паролю (`ADMIN_PASSWORD`)
- Статистика: всего пользователей, активные подписки, по тарифам, истекающие за 3 дня
- Добавление пользователя (Telegram ID и/или email, тариф, срок)
- Продление на +30 / +90 / +365 дней, смена тарифа, блокировка, удаление
- Поиск и фильтр по тарифу
- API для приложения: проверка подписки и регистрация пользователя

## Запуск
1. Создайте проект на supabase.com, в **SQL Editor** выполните `supabase/schema.sql`.
2. На vercel.com: **Add New → Project**, выберите этот репозиторий, **Root Directory = `admin`**.
3. В **Environment Variables** добавьте переменные из `.env.example`.
4. Deploy.

Локально: `cp .env.example .env.local`, заполнить, `npm install && npm run dev`.

## API для приложения
Заголовок `x-api-key: <APP_API_KEY>`.

```
GET  /api/subscription?telegram_id=123
→ {"exists":true,"active":true,"plan":"pro","status":"active","expires_at":"..."}

POST /api/subscription   {"telegram_id":"123","name":"Иван"}
→ регистрирует нового пользователя с тарифом free (существующих не трогает)
```

Пример на Python:
```python
import requests
r = requests.get(f"{ADMIN_URL}/api/subscription", params={"telegram_id": user_id},
                 headers={"x-api-key": APP_API_KEY}).json()
if not r["active"]:
    ...  # предложить оформить подписку
```
