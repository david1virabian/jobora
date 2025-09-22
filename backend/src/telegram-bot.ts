import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

if (!BOT_TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN not found in environment variables');
  process.exit(1);
}

// Создаем бота
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

console.log('🤖 Jobora Telegram Bot started!');

// Обработка команды /start
bot.onText(/\/start(.*)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from?.id;
  const username = msg.from?.username;
  const firstName = msg.from?.first_name;
  const lastName = msg.from?.last_name;
  
  console.log(`📱 /start command from ${username} (${userId})`);

  // Проверяем, есть ли код авторизации в команде
  const authCode = match?.[1]?.trim();
  
  if (authCode) {
    // Пользователь пришел с кодом авторизации из веб-приложения
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/telegram/confirm`, {
        code: authCode,
        userId,
        username,
        firstName,
        lastName
      });

      if (response.data.success) {
        await bot.sendMessage(chatId, `✅ Авторизация успешна!

Добро пожаловать в Jobora, ${firstName}! 

Теперь вы можете управлять поиском работы через этот бот. Вернитесь в веб-приложение - вы автоматически войдете в систему.

Доступные команды:
/help - Показать все команды
/search - Поиск вакансий
/applications - Мои отклики
/settings - Настройки`);
      } else {
        await bot.sendMessage(chatId, `❌ Ошибка авторизации: ${response.data.error || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      console.error('Auth confirmation error:', error);
      await bot.sendMessage(chatId, '❌ Ошибка при подтверждении авторизации. Попробуйте еще раз.');
    }
  } else {
    // Обычное приветствие
    await bot.sendMessage(chatId, `👋 Привет, ${firstName}!

Я Jobora - ваш ИИ-помощник для поиска работы на HH.ru.

🔧 Что я умею:
• Автоматический поиск подходящих вакансий
• Генерация персональных сопроводительных писем с помощью ИИ
• Отслеживание статуса откликов
• Уведомления о новых сообщениях от рекрутеров

📱 Как начать:
1. Откройте веб-приложение: http://localhost:3000
2. Нажмите "Войти через Telegram"
3. Вернитесь сюда и подтвердите авторизацию

Или используйте команды прямо здесь:
/help - Показать все команды`);
  }
});

// Обработка команды /help
bot.onText(/\/help/, async (msg) => {
  const chatId = msg.chat.id;
  
  await bot.sendMessage(chatId, `❓ Справка по командам Jobora

🔍 Поиск и отклики:
/search - Найти новые вакансии
/applications - Посмотреть мои отклики

💬 Сообщения:
/messages - Сообщения от рекрутеров

⚙️ Настройки:
/settings - Основные настройки

📊 Статистика:
/stats - Статистика откликов

🌐 Веб-приложение: http://localhost:3000`);
});

// Обработка ошибок
bot.on('error', (error) => {
  console.error('❌ Telegram Bot Error:', error);
});

bot.on('polling_error', (error) => {
  console.error('❌ Telegram Bot Polling Error:', error);
});

export default bot;