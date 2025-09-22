# 🚀 Jobora - Быстрый запуск

## 📋 Предварительные требования

- Node.js 18+ 
- Docker и Docker Compose
- Git

## ⚡ Быстрый запуск (5 минут)

### 1. Запуск баз данных
```bash
# В корневой папке проекта
docker-compose up -d

# Проверить что контейнеры запустились
docker-compose ps
```

### 2. Настройка Backend
```bash
cd backend

# Установка зависимостей
npm install

# Настройка базы данных
npm run db:generate
npm run db:push

# Запуск сервера
npm run dev
```

Backend будет доступен на http://localhost:3001

### 3. Настройка Frontend  
```bash
# В новом терминале, из корневой папки
npm install

# Запуск фронтенда
npm run dev
```

Frontend будет доступен на http://localhost:3000

## ✅ Проверка работы

1. **Откройте** http://localhost:3000
2. **Проверьте API** http://localhost:3001/health
3. **Telegram бот готов** - найдите @YourBotName в Telegram

## 🔧 Конфигурация завершена

Все API ключи уже настроены:
- ✅ HH.ru API ключи
- ✅ OpenAI GPT-4 ключ  
- ✅ Telegram Bot Token
- ✅ PostgreSQL база данных
- ✅ Redis кэш

## 🎯 Что дальше?

1. **Зарегистрируйтесь** в веб-приложении
2. **Подключите HH.ru** через настройки
3. **Настройте параметры поиска**
4. **Запустите автопоиск вакансий**

## 🐛 Решение проблем

### PostgreSQL не запускается
```bash
# Остановить и пересоздать контейнеры
docker-compose down
docker-compose up -d --force-recreate
```

### Ошибки миграций
```bash
cd backend
npm run db:push --force-reset
```

### Порты заняты
Измените порты в docker-compose.yml если 5432 или 6379 заняты.

## 📱 Telegram Bot команды

- `/start` - Начать работу
- `/search` - Поиск вакансий  
- `/applications` - Мои отклики
- `/settings` - Настройки
- `/stats` - Статистика

---

**Все готово! Jobora найдет и подаст отклики на подходящие вакансии автоматически! 🎉**