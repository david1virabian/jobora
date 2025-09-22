# Jobora Backend

AI-powered job search assistant backend for automating applications on hh.ru with intelligent cover letter generation and Telegram bot integration.

## 🚀 Features

- **HH.ru Integration**: Seamless OAuth authentication and job application automation
- **AI Cover Letters**: OpenAI-powered personalized cover letter generation
- **Telegram Bot**: Complete bot interface for job search management
- **Auto-Applications**: Background job processing for automated job applications
- **Real-time Sync**: Automatic synchronization with HH.ru application status
- **Comprehensive API**: RESTful endpoints for all frontend operations

## 🛠 Technology Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Cache/Queue**: Redis + Bull Queue
- **Authentication**: JWT + OAuth (HH.ru)
- **AI Integration**: OpenAI GPT-4
- **Bot Framework**: node-telegram-bot-api
- **Security**: Helmet, CORS, Rate Limiting

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL 14+
- Redis 6+
- HH.ru API credentials
- OpenAI API key
- Telegram Bot token

## ⚙️ Installation

1. **Clone and install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Environment setup**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database setup**:
   ```bash
   npm run db:generate
   npm run db:push
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

## 🔧 Environment Variables

### Required Configuration

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/jobora_db"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# HH.ru API
HH_CLIENT_ID="your-hh-client-id"
HH_CLIENT_SECRET="your-hh-client-secret"
HH_REDIRECT_URI="http://localhost:3001/auth/hh/callback"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# Telegram
TELEGRAM_BOT_TOKEN="your-telegram-bot-token"
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/hh/authorize` - Get HH.ru auth URL
- `GET /api/auth/hh/callback` - HH.ru OAuth callback

### Application Management

- `GET /api/applications` - List user applications
- `POST /api/applications` - Submit new application
- `GET /api/applications/stats` - Application statistics
- `POST /api/applications/sync` - Sync with HH.ru

### Job Search

- `GET /api/jobs/search` - Search vacancies
- `GET /api/jobs/recommendations` - Get AI recommendations
- `POST /api/jobs/auto-search` - Start automated search

### Messages

- `GET /api/messages` - Get recruiter messages
- `POST /api/messages/respond` - AI-generated responses

### User Management

- `GET /api/user/preferences` - Get user preferences
- `PUT /api/user/preferences` - Update preferences
- `GET /api/user/profile` - Get user profile

## 🤖 AI Features

### Cover Letter Generation

The system generates personalized cover letters using:
- Vacancy requirements analysis
- User experience matching
- Company-specific customization
- Professional tone optimization

### Smart Job Matching

AI-powered job recommendations based on:
- Skills compatibility
- Experience level alignment
- Salary expectations
- Location preferences

### Response Generation

Automated recruiter response generation with:
- Context-aware replies
- Professional tone maintenance
- Interview scheduling assistance

## 🔄 Background Jobs

### Auto-Application Process

1. **Job Discovery**: Periodic search for new vacancies
2. **Compatibility Check**: AI-powered job matching
3. **Cover Letter Generation**: Personalized letter creation
4. **Application Submission**: Automated application process
5. **Status Tracking**: Real-time status monitoring

### Sync Operations

- **Application Status Sync**: Regular HH.ru status updates
- **Message Retrieval**: New recruiter message fetching
- **Profile Updates**: User preference synchronization

## 📱 Telegram Bot Commands

- `/start` - Initialize bot interaction
- `/search <query>` - Search for jobs
- `/applications` - View application status
- `/settings` - Configure preferences
- `/stats` - View statistics
- `/stop` - Pause auto-applications

## 🔒 Security Features

- **JWT Authentication**: Secure user sessions
- **Rate Limiting**: API abuse prevention
- **Input Validation**: Comprehensive data validation
- **CORS Protection**: Cross-origin request security
- **Helmet Security**: HTTP header protection

## 📊 Monitoring & Health

- `GET /health` - Basic health check
- `GET /health/detailed` - Service status monitoring
- `GET /health/metrics` - System metrics

## 🚀 Deployment

### Production Setup

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm start
   ```

3. **Set up process manager** (PM2 recommended):
   ```bash
   pm2 start dist/index.js --name jobora-backend
   ```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint
```

## 📈 Performance Optimization

- **Redis Caching**: Frequently accessed data caching
- **Database Indexing**: Optimized query performance
- **Connection Pooling**: Efficient resource management
- **Background Processing**: Non-blocking operations

## 🔧 Development

### Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # API route handlers
├── integrations/    # External service integrations
├── middleware/      # Express middleware
├── services/        # Business logic
├── jobs/           # Background job definitions
├── utils/          # Utility functions
└── types/          # TypeScript type definitions
```

### Code Quality

- **TypeScript**: Full type safety
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality checks

## 📞 Support

For questions or issues:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 📄 License

MIT License - see LICENSE file for details