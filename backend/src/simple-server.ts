import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import and start Telegram bot
import './telegram-bot';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Jobora Backend API (Simple Mode)',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Telegram auth endpoints
const pendingAuth = new Map(); // В реальном приложении используйте Redis

app.get('/api/auth/telegram/check', (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.json({ success: false, error: 'Missing auth code' });
  }

  const authData = pendingAuth.get(code);
  
  if (authData && authData.token) {
    // Очищаем использованный код
    pendingAuth.delete(code);
    
    return res.json({
      success: true,
      token: authData.token,
      user: authData.user
    });
  } else {
    return res.json({
      success: false,
      message: 'Auth pending'
    });
  }
});

app.post('/api/auth/telegram/confirm', (req, res) => {
  const { code, userId, username, firstName, lastName } = req.body;
  
  if (!code || !userId) {
    return res.json({ success: false, error: 'Missing required fields' });
  }

  // Генерируем JWT токен
  const token = `telegram_jwt_${userId}_${Date.now()}`;
  
  // Сохраняем данные авторизации
  pendingAuth.set(code, {
    token,
    user: {
      id: userId,
      username,
      firstName,
      lastName,
      platform: 'telegram'
    },
    confirmedAt: new Date()
  });

  console.log(`Telegram auth confirmed for user ${username} (${userId}) with code ${code}`);

  return res.json({
    success: true,
    message: 'Authorization confirmed'
  });
});

// Mock API endpoints for frontend testing
app.get('/api/applications/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      total: 142,
      today: 3,
      week: 15,
      month: 67,
      statusBreakdown: {
        SENT: 45,
        VIEWED: 32,
        RESPONDED: 15,
        REJECTED: 38,
        INVITED: 12
      },
      responseRate: 19
    }
  });
});

app.get('/api/applications', (req, res) => {
  res.json({
    success: true,
    data: {
      applications: [
        {
          id: '1',
          hhVacancyId: 'hh123',
          vacancyTitle: 'Senior Frontend Developer (React)',
          companyName: 'TechCorp LLC',
          status: 'RESPONDED',
          appliedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          salaryFrom: 150000,
          salaryTo: 200000,
          location: 'Москва'
        },
        {
          id: '2',
          hhVacancyId: 'hh456',
          vacancyTitle: 'React Native Developer',
          companyName: 'Mobile Startup',
          status: 'VIEWED',
          appliedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          salaryFrom: 120000,
          salaryTo: 180000,
          location: 'Удаленно'
        },
        {
          id: '3',
          hhVacancyId: 'hh789',
          vacancyTitle: 'Full Stack JavaScript Developer',
          companyName: 'Digital Agency',
          status: 'SENT',
          appliedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          salaryFrom: 100000,
          salaryTo: 150000,
          location: 'Санкт-Петербург'
        }
      ],
      pagination: {
        page: 1,
        limit: 20,
        total: 3,
        totalPages: 1
      }
    }
  });
});

app.get('/api/messages', (req, res) => {
  res.json({
    success: true,
    data: {
      messages: [
        {
          id: '1',
          fromRecruiter: true,
          recruiterName: 'Анна Петрова',
          content: 'Добрый день! Ваше резюме заинтересовало нас. Хотели бы пригласить на собеседование в четверг в 15:00. Подходит ли вам это время?',
          isRead: false,
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          application: {
            id: '1',
            vacancyTitle: 'Senior Frontend Developer (React)',
            companyName: 'TechCorp LLC'
          }
        },
        {
          id: '2',
          fromRecruiter: true,
          recruiterName: 'Михаил Сидоров',
          content: 'Здравствуйте! Мы рассмотрели ваш отклик. К сожалению, на данный момент мы выбрали другого кандидата. Спасибо за интерес к нашей компании!',
          isRead: true,
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          application: {
            id: '2',
            vacancyTitle: 'React Developer',
            companyName: 'StartupTech'
          }
        },
        {
          id: '3',
          fromRecruiter: true,
          recruiterName: 'Елена Козлова',
          content: 'Приветствую! Хотели бы узнать больше о вашем опыте работы с Node.js. Можете ли вы рассказать о последних проектах?',
          isRead: false,
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          application: {
            id: '3',
            vacancyTitle: 'Full Stack Developer',
            companyName: 'Digital Solutions'
          }
        }
      ],
      pagination: {
        page: 1,
        limit: 20,
        total: 3,
        totalPages: 1
      }
    }
  });
});

app.patch('/api/messages/:id/read', (req, res) => {
  res.json({
    success: true,
    message: 'Message marked as read'
  });
});

// Catch-all for unknown routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.originalUrl,
  });
});

// Error handler
app.use((error: any, req: any, res: any, next: any) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Jobora Backend (Simple Mode) running on port ${PORT}`);
  console.log(`📖 API: http://localhost:${PORT}`);
  console.log(`🔗 Frontend: http://localhost:3000`);
});

export default app;