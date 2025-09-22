import TelegramBot from 'node-telegram-bot-api';
import { config } from '@/config/env';
import { logger } from '@/utils/logger';
import { TelegramMessage, TelegramUser } from '@/types';

export class TelegramService {
  private bot: TelegramBot;
  private webhookSet = false;

  constructor() {
    this.bot = new TelegramBot(config.telegram.botToken, {
      polling: !config.telegram.webhookUrl,
      webHook: !!config.telegram.webhookUrl,
    });

    this.setupCommands();
    this.setupEventHandlers();
  }

  /**
   * Setup bot commands
   */
  private async setupCommands() {
    try {
      await this.bot.setMyCommands([
        { command: '/start', description: 'Начать работу с ботом' },
        { command: '/help', description: 'Помощь по командам' },
        { command: '/search', description: 'Поиск вакансий' },
        { command: '/applications', description: 'Мои отклики' },
        { command: '/settings', description: 'Настройки поиска' },
        { command: '/stats', description: 'Статистика откликов' },
        { command: '/stop', description: 'Остановить автопоиск' },
      ]);

      logger.info('Telegram bot commands set successfully');
    } catch (error) {
      logger.error('Failed to set Telegram bot commands:', error);
    }
  }

  /**
   * Setup event handlers
   */
  private setupEventHandlers() {
    // Handle /start command
    this.bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      const user = msg.from;

      logger.info('User started bot interaction', { chatId, user });

      const welcomeMessage = `🤖 Привет! Я Jobora - твой ИИ помощник по поиску работы на hh.ru

Что я умею:
✅ Автоматически искать подходящие вакансии
✅ Составлять персонализированные сопроводительные письма
✅ Подавать отклики за тебя
✅ Отслеживать статус откликов
✅ Уведомлять о новых сообщениях от рекрутеров

Для начала работы нужно:
1. Авторизоваться в hh.ru (/auth)
2. Настроить параметры поиска (/settings)
3. Запустить автопоиск (/search)

Используй /help для получения списка всех команд.`;

      await this.sendMessage(chatId, welcomeMessage, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🔐 Авторизация HH.ru', callback_data: 'auth_hh' },
              { text: '⚙️ Настройки', callback_data: 'settings' },
            ],
            [
              { text: '🔍 Начать поиск', callback_data: 'start_search' },
              { text: '📊 Статистика', callback_data: 'stats' },
            ],
          ],
        },
      });
    });

    // Handle /help command
    this.bot.onText(/\/help/, async (msg) => {
      const chatId = msg.chat.id;

      const helpMessage = `📋 Доступные команды:

🏠 Основные:
/start - Запуск бота
/help - Эта справка

🔐 Авторизация:
/auth - Авторизация в hh.ru
/profile - Информация профиля

🔍 Поиск работы:
/search - Поиск вакансий
/settings - Настройки поиска
/stop - Остановить автопоиск

📋 Отклики:
/applications - Список откликов
/stats - Статистика

💬 Сообщения:
/messages - Сообщения от рекрутеров

⚙️ Управление:
/status - Статус системы
/feedback - Обратная связь`;

      await this.sendMessage(chatId, helpMessage);
    });

    // Handle /search command
    this.bot.onText(/\/search(?:\s+(.+))?/, async (msg, match) => {
      const chatId = msg.chat.id;
      const searchQuery = match?.[1];

      if (searchQuery) {
        await this.handleJobSearch(chatId, msg.from!, searchQuery);
      } else {
        await this.sendSearchKeyboard(chatId);
      }
    });

    // Handle /applications command
    this.bot.onText(/\/applications/, async (msg) => {
      const chatId = msg.chat.id;
      await this.handleApplicationsList(chatId, msg.from!);
    });

    // Handle /settings command
    this.bot.onText(/\/settings/, async (msg) => {
      const chatId = msg.chat.id;
      await this.sendSettingsKeyboard(chatId);
    });

    // Handle /stats command
    this.bot.onText(/\/stats/, async (msg) => {
      const chatId = msg.chat.id;
      await this.handleStats(chatId, msg.from!);
    });

    // Handle callback queries
    this.bot.on('callback_query', async (query) => {
      const chatId = query.message!.chat.id;
      const data = query.data!;
      const user = query.from;

      await this.bot.answerCallbackQuery(query.id);
      await this.handleCallbackQuery(chatId, user, data);
    });

    // Handle text messages
    this.bot.on('message', async (msg) => {
      if (msg.text && !msg.text.startsWith('/')) {
        await this.handleTextMessage(msg);
      }
    });

    // Error handling
    this.bot.on('error', (error) => {
      logger.error('Telegram bot error:', error);
    });

    // Polling error handling
    this.bot.on('polling_error', (error) => {
      logger.error('Telegram polling error:', error);
    });
  }

  /**
   * Send search keyboard
   */
  private async sendSearchKeyboard(chatId: number) {
    const message = `🔍 Поиск вакансий

Выберите тип поиска:`;

    await this.sendMessage(chatId, message, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🚀 Быстрый поиск', callback_data: 'quick_search' },
            { text: '⚙️ Настроить поиск', callback_data: 'custom_search' },
          ],
          [
            { text: '🤖 Автопоиск', callback_data: 'auto_search' },
            { text: '📋 Сохраненные поиски', callback_data: 'saved_searches' },
          ],
        ],
      },
    });
  }

  /**
   * Send settings keyboard
   */
  private async sendSettingsKeyboard(chatId: number) {
    const message = `⚙️ Настройки

Что хотите настроить?`;

    await this.sendMessage(chatId, message, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '💼 Желаемые позиции', callback_data: 'set_positions' },
            { text: '💰 Зарплатные ожидания', callback_data: 'set_salary' },
          ],
          [
            { text: '🌍 Города поиска', callback_data: 'set_locations' },
            { text: '📅 Опыт работы', callback_data: 'set_experience' },
          ],
          [
            { text: '⏰ График работы', callback_data: 'set_schedule' },
            { text: '🏢 Тип занятости', callback_data: 'set_employment' },
          ],
          [
            { text: '🤖 Автоотклики', callback_data: 'set_auto_apply' },
            { text: '📝 Шаблон письма', callback_data: 'set_cover_letter' },
          ],
        ],
      },
    });
  }

  /**
   * Handle callback queries
   */
  private async handleCallbackQuery(chatId: number, user: TelegramUser, data: string) {
    switch (data) {
      case 'auth_hh':
        await this.handleAuthHH(chatId, user);
        break;
      case 'settings':
        await this.sendSettingsKeyboard(chatId);
        break;
      case 'start_search':
        await this.sendSearchKeyboard(chatId);
        break;
      case 'stats':
        await this.handleStats(chatId, user);
        break;
      case 'quick_search':
        await this.handleQuickSearch(chatId, user);
        break;
      case 'auto_search':
        await this.handleAutoSearch(chatId, user);
        break;
      default:
        if (data.startsWith('set_')) {
          await this.handleSettingChange(chatId, user, data);
        } else if (data.startsWith('apply_')) {
          await this.handleApplicationAction(chatId, user, data);
        }
        break;
    }
  }

  /**
   * Handle HH.ru authorization
   */
  private async handleAuthHH(chatId: number, user: TelegramUser) {
    // This will be implemented when we have the auth service
    const authUrl = `https://your-domain.com/api/auth/hh?telegram_id=${user.id}`;
    
    const message = `🔐 Авторизация в HH.ru

Для работы с ботом необходимо авторизоваться в HH.ru.

Нажмите кнопку ниже для перехода на страницу авторизации:`;

    await this.sendMessage(chatId, message, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🔐 Авторизоваться в HH.ru', url: authUrl }],
        ],
      },
    });
  }

  /**
   * Handle job search
   */
  private async handleJobSearch(chatId: number, user: TelegramUser, query: string) {
    const message = `🔍 Поиск вакансий: "${query}"

⏳ Ищу подходящие вакансии...`;

    const sentMessage = await this.sendMessage(chatId, message);

    // Here we would integrate with the job search service
    // For now, just show a placeholder response
    setTimeout(async () => {
      const resultMessage = `✅ Поиск завершен!

Найдено: 15 вакансий
Подходящих: 8 вакансий
Отклики отправлены: 5

📋 Последние отклики:
• Frontend Developer - TechCorp LLC
• React Developer - StartupTech
• JavaScript Developer - Digital Agency

Используйте /applications для просмотра всех откликов.`;

      await this.editMessage(chatId, sentMessage.message_id, resultMessage);
    }, 3000);
  }

  /**
   * Handle applications list
   */
  private async handleApplicationsList(chatId: number, user: TelegramUser) {
    // This will be implemented with the applications service
    const message = `📋 Ваши отклики

📊 Статистика:
• Сегодня: 3 отклика
• За неделю: 15 откликов
• Всего: 142 отклика

🔄 Последние отклики:
✅ Senior Frontend Developer - Ответ получен
👁️ React Native Developer - Просмотрено  
📤 Full Stack Developer - Отправлено

Используйте /stats для подробной статистики.`;

    await this.sendMessage(chatId, message, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📊 Подробная статистика', callback_data: 'detailed_stats' },
            { text: '🔍 Найти новые', callback_data: 'start_search' },
          ],
        ],
      },
    });
  }

  /**
   * Handle stats request
   */
  private async handleStats(chatId: number, user: TelegramUser) {
    const message = `📊 Статистика откликов

📅 За сегодня:
• Отклики: 3
• Просмотры: 1
• Ответы: 1

📈 За неделю:
• Отклики: 15
• Просмотры: 8
• Ответы: 3
• Приглашения: 1

🎯 Общая статистика:
• Всего откликов: 142
• Процент ответов: 15%
• Средняя зарплата: 180,000 ₽

🔥 Топ компании:
1. TechCorp LLC - 3 отклика
2. StartupTech - 2 отклика
3. Digital Agency - 2 отклика`;

    await this.sendMessage(chatId, message);
  }

  /**
   * Handle quick search
   */
  private async handleQuickSearch(chatId: number, user: TelegramUser) {
    const message = `🚀 Быстрый поиск

Запускаю поиск с вашими сохраненными настройками...

⏳ Поиск вакансий...`;

    await this.sendMessage(chatId, message);
  }

  /**
   * Handle auto search toggle
   */
  private async handleAutoSearch(chatId: number, user: TelegramUser) {
    const message = `🤖 Автоматический поиск

Статус: ✅ Включен
Частота: каждые 30 минут
Максимум откликов в день: 10

Автопоиск будет искать новые вакансии и автоматически подавать отклики согласно вашим настройкам.`;

    await this.sendMessage(chatId, message, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '⏸️ Приостановить', callback_data: 'pause_auto_search' },
            { text: '⚙️ Настроить', callback_data: 'configure_auto_search' },
          ],
          [{ text: '🛑 Остановить', callback_data: 'stop_auto_search' }],
        ],
      },
    });
  }

  /**
   * Handle setting changes
   */
  private async handleSettingChange(chatId: number, user: TelegramUser, setting: string) {
    const settingName = setting.replace('set_', '');
    
    const messages: Record<string, string> = {
      positions: '💼 Введите желаемые позиции через запятую:\n\nНапример: Frontend Developer, React Developer, JavaScript Developer',
      salary: '💰 Введите желаемую зарплату:\n\nФормат: от-до\nНапример: 150000-250000',
      locations: '🌍 Введите города для поиска через запятую:\n\nНапример: Москва, Санкт-Петербург, Новосибирск',
      experience: '📅 Выберите ваш уровень опыта:',
      schedule: '⏰ Выберите предпочитаемый график работы:',
      employment: '🏢 Выберите тип занятости:',
      auto_apply: '🤖 Настройки автооткликов:',
      cover_letter: '📝 Введите шаблон сопроводительного письма:',
    };

    await this.sendMessage(chatId, messages[settingName] || 'Настройка...');
  }

  /**
   * Handle application actions
   */
  private async handleApplicationAction(chatId: number, user: TelegramUser, action: string) {
    const [, applicationId, actionType] = action.split('_');
    
    let message = '';
    switch (actionType) {
      case 'view':
        message = '👁️ Открываю вакансию на hh.ru...';
        break;
      case 'respond':
        message = '💬 Открываю страницу для ответа...';
        break;
      case 'hide':
        message = '🚫 Скрываю вакансию из списка...';
        break;
    }

    await this.sendMessage(chatId, message);
  }

  /**
   * Handle text messages
   */
  private async handleTextMessage(msg: TelegramMessage) {
    const chatId = msg.chat.id;
    const text = msg.text!;

    // Handle different contexts based on the last action
    if (text.includes('@')) {
      // Might be setting email or something similar
      await this.sendMessage(chatId, '✅ Настройка сохранена!');
    } else if (text.match(/\d+/)) {
      // Might be setting salary or other numeric value
      await this.sendMessage(chatId, '💰 Зарплатные ожидания обновлены!');
    } else {
      // General text - might be position search or setting
      await this.sendMessage(chatId, `🔍 Ищу вакансии по запросу: "${text}"`);
    }
  }

  /**
   * Set webhook for production
   */
  async setWebhook(url: string): Promise<boolean> {
    try {
      await this.bot.setWebHook(url);
      this.webhookSet = true;
      logger.info('Telegram webhook set successfully', { url });
      return true;
    } catch (error) {
      logger.error('Failed to set Telegram webhook:', error);
      return false;
    }
  }

  /**
   * Process webhook update
   */
  async processWebhookUpdate(update: any): Promise<void> {
    try {
      this.bot.processUpdate(update);
    } catch (error) {
      logger.error('Failed to process webhook update:', error);
    }
  }

  /**
   * Send message with error handling
   */
  async sendMessage(
    chatId: number,
    text: string,
    options?: any
  ): Promise<TelegramBot.Message> {
    try {
      return await this.bot.sendMessage(chatId, text, {
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        ...options,
      });
    } catch (error) {
      logger.error('Failed to send Telegram message:', error);
      throw error;
    }
  }

  /**
   * Edit message with error handling
   */
  async editMessage(
    chatId: number,
    messageId: number,
    text: string,
    options?: any
  ): Promise<boolean | TelegramBot.Message> {
    try {
      return await this.bot.editMessageText(text, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'HTML',
        ...options,
      });
    } catch (error) {
      logger.error('Failed to edit Telegram message:', error);
      return false;
    }
  }

  /**
   * Send notification to user
   */
  async sendNotification(
    telegramUserId: string,
    title: string,
    message: string,
    buttons?: Array<{ text: string; callback_data: string }>
  ): Promise<boolean> {
    try {
      const fullMessage = `🔔 ${title}\n\n${message}`;
      
      const options: any = { parse_mode: 'HTML' };
      
      if (buttons && buttons.length > 0) {
        options.reply_markup = {
          inline_keyboard: [buttons],
        };
      }

      await this.bot.sendMessage(parseInt(telegramUserId), fullMessage, options);
      return true;
    } catch (error) {
      logger.error('Failed to send notification:', error);
      return false;
    }
  }

  /**
   * Check if bot is healthy
   */
  async healthCheck(): Promise<boolean> {
    try {
      const me = await this.bot.getMe();
      return !!me.id;
    } catch (error) {
      logger.error('Telegram bot health check failed:', error);
      return false;
    }
  }
}