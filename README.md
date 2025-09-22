# 🤖 Jobora - AI Job Search Assistant

Автоматизированный помощник для поиска работы на HH.ru с интеграцией ИИ и Telegram-ботом.

## 🚀 Быстрый запуск

### 1. Backend
```bash
cd backend
npm install
npm run dev
```
Backend запустится на: http://localhost:3001

### 2. Frontend
```bash
npm install
PORT=3000 npm run dev
```
Frontend запустится на: http://localhost:3000

## ✨ Возможности

- 🔍 **Автоматический поиск** вакансий на HH.ru
- 🤖 **ИИ-генерация** сопроводительных писем (OpenAI GPT-4)
- 📱 **Telegram-бот** для управления поиском
- 📊 **Статистика** откликов и ответов
- 💬 **Уведомления** о сообщениях от рекрутеров
- ⚙️ **Настройки** автопоиска и фильтров

## 🛠 Технологии

### Frontend
- Next.js 14 + TypeScript
- Tailwind CSS + Radix UI
- React Hook Form + Zod
- Axios для API запросов

### Backend
- Node.js + Express.js + TypeScript
- SQLite/PostgreSQL + Prisma ORM
- JWT Authentication + OAuth
- Интеграции: HH.ru API, OpenAI API, Telegram Bot API

## 📡 API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/hh/authorize` - OAuth HH.ru

### Отклики
- `GET /api/applications` - Список откликов
- `GET /api/applications/stats` - Статистика
- `POST /api/applications` - Подать отклик

### Сообщения
- `GET /api/messages` - Сообщения от рекрутеров
- `PATCH /api/messages/:id/read` - Отметить прочитанным

### Поиск работы
- `POST /api/jobs/search` - Поиск вакансий
- `POST /api/jobs/auto-search` - Автопоиск

## 🔧 Настройка

1. Скопируйте `backend/.env.example` в `backend/.env`
2. Заполните API ключи:
   - HH.ru Client ID/Secret
   - OpenAI API Key
   - Telegram Bot Token

## 📱 Telegram Bot

Команды:
- `/start` - Начать работу
- `/search` - Поиск вакансий
- `/applications` - Мои отклики
- `/settings` - Настройки
- `/stats` - Статистика

## 🗄️ База данных

По умолчанию используется SQLite (`backend/prisma/dev.db`).

Для PostgreSQL:
```bash
brew install postgresql@15
brew services start postgresql@15
```

## 🐛 Troubleshooting

### Backend не запускается
```bash
cd backend
npm run dev
```

### Frontend не подключается к API
Проверьте в `lib/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:3001/api'
```

## 📄 Лицензия

MIT License
