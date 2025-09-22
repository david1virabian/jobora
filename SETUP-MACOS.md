# 🍎 Jobora - Установка на macOS

## 📋 Установка зависимостей

### 1. Установка Homebrew (если не установлен)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Установка PostgreSQL
```bash
# Установка
brew install postgresql@15

# Запуск сервиса
brew services start postgresql@15

# Создание базы данных
createdb jobora_db
```

### 3. Установка Redis
```bash
# Установка
brew install redis

# Запуск сервиса
brew services start redis
```

### 4. Проверка установки
```bash
# Проверка PostgreSQL
psql jobora_db -c "SELECT version();"

# Проверка Redis
redis-cli ping
```

## 🔧 Настройка базы данных

### Создание пользователя PostgreSQL
```bash
# Подключение к PostgreSQL
psql postgres

# В консоли PostgreSQL:
CREATE USER jobora WITH PASSWORD 'jobora123';
GRANT ALL PRIVILEGES ON DATABASE jobora_db TO jobora;
ALTER USER jobora CREATEDB;
\q
```

## ⚡ Запуск проекта

### 1. Backend
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

### 2. Frontend
```bash
# В новом терминале
npm install
npm run dev
```

## ✅ Проверка

1. Backend: http://localhost:3001/health
2. Frontend: http://localhost:3000
3. База данных: `psql jobora_db -c "SELECT NOW();"`
4. Redis: `redis-cli ping`

## 🔄 Управление сервисами

### Остановка сервисов
```bash
brew services stop postgresql@15
brew services stop redis
```

### Запуск сервисов
```bash
brew services start postgresql@15
brew services start redis
```

### Статус сервисов
```bash
brew services list | grep -E "(postgresql|redis)"
```

## 🐛 Решение проблем

### PostgreSQL не запускается
```bash
# Переустановка
brew uninstall postgresql@15
brew install postgresql@15
brew services start postgresql@15
```

### Ошибка подключения к БД
```bash
# Проверка конфигурации
cat /opt/homebrew/var/postgresql@15/postgresql.conf | grep port
```

### Redis не отвечает
```bash
# Перезапуск
brew services restart redis
```

---

**Теперь все готово для запуска Jobora! 🚀**