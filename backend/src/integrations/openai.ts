import OpenAI from 'openai';
import { config } from '@/config/env';
import { logger } from '@/utils/logger';
import { CoverLetterRequest, OpenAIMessage } from '@/types';

export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openai.apiKey,
    });
  }

  /**
   * Generate a cover letter based on vacancy and user information
   */
  async generateCoverLetter(request: CoverLetterRequest): Promise<string> {
    try {
      const systemPrompt = `Ты - профессиональный HR-консультант, который помогает соискателям составлять эффективные сопроводительные письма для откликов на вакансии на hh.ru.

Твоя задача:
1. Создать персонализированное сопроводительное письмо на русском языке
2. Письмо должно быть профессиональным, но дружелюбным
3. Подчеркнуть релевантный опыт и навыки кандидата
4. Показать заинтересованность в конкретной позиции и компании
5. Объем письма не должен превышать ${config.app.coverLetterMaxLength} символов
6. Избегать шаблонных фраз и банальностей
7. Письмо должно быть структурированным: приветствие, основная часть, заключение

Требования к стилю:
- Деловой, но не официозный тон
- Конкретные примеры вместо общих слов
- Активный залог
- Уверенность без наглости
- Проявление знания о компании/проекте (если информация доступна)`;

      const userPrompt = `Составь сопроводительное письмо для отклика на вакансию:

Позиция: ${request.vacancyTitle}
Компания: ${request.companyName}
${request.requirements ? `Требования: ${request.requirements}` : ''}
${request.responsibilities ? `Обязанности: ${request.responsibilities}` : ''}

Информация о кандидате:
Опыт работы: ${request.userExperience}
Ключевые навыки: ${request.userSkills.join(', ')}
${request.additionalInfo ? `Дополнительная информация: ${request.additionalInfo}` : ''}

Сопроводительное письмо должно быть адаптировано под эту конкретную вакансию.`;

      const messages: OpenAIMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ];

      const response = await this.openai.chat.completions.create({
        model: config.openai.model,
        messages,
        max_tokens: 1000,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      });

      const coverLetter = response.choices[0]?.message?.content;

      if (!coverLetter) {
        throw new Error('No cover letter generated');
      }

      logger.info('Cover letter generated successfully', {
        vacancyTitle: request.vacancyTitle,
        companyName: request.companyName,
        letterLength: coverLetter.length,
      });

      return coverLetter.trim();
    } catch (error) {
      logger.error('Failed to generate cover letter:', error);
      throw new Error('Failed to generate cover letter with AI');
    }
  }

  /**
   * Improve existing cover letter
   */
  async improveCoverLetter(
    originalLetter: string,
    improvements: string[]
  ): Promise<string> {
    try {
      const systemPrompt = `Ты - профессиональный редактор сопроводительных писем. Твоя задача - улучшить существующее письмо согласно указанным замечаниям, сохранив при этом его основную структуру и смысл.

Принципы улучшения:
1. Сохранить профессиональный тон
2. Улучшить читаемость и структуру
3. Сделать письмо более персонализированным
4. Убрать лишние слова и повторы
5. Усилить аргументы в пользу кандидата
6. Объем не должен превышать ${config.app.coverLetterMaxLength} символов`;

      const userPrompt = `Улучши это сопроводительное письмо:

ОРИГИНАЛЬНОЕ ПИСЬМО:
${originalLetter}

ТРЕБОВАНИЯ К УЛУЧШЕНИЮ:
${improvements.join('\n')}

Предоставь улучшенную версию письма.`;

      const messages: OpenAIMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ];

      const response = await this.openai.chat.completions.create({
        model: config.openai.model,
        messages,
        max_tokens: 1000,
        temperature: 0.5,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      });

      const improvedLetter = response.choices[0]?.message?.content;

      if (!improvedLetter) {
        throw new Error('No improved cover letter generated');
      }

      logger.info('Cover letter improved successfully', {
        originalLength: originalLetter.length,
        improvedLength: improvedLetter.length,
        improvements: improvements.length,
      });

      return improvedLetter.trim();
    } catch (error) {
      logger.error('Failed to improve cover letter:', error);
      throw new Error('Failed to improve cover letter with AI');
    }
  }

  /**
   * Generate personalized response to recruiter message
   */
  async generateRecruiterResponse(
    recruiterMessage: string,
    context: {
      vacancyTitle: string;
      companyName: string;
      userExperience: string;
      responseType: 'positive' | 'questions' | 'decline';
    }
  ): Promise<string> {
    try {
      const systemPrompt = `Ты - профессиональный консультант по карьере, который помогает кандидатам отвечать на сообщения от рекрутеров.

Принципы ответа:
1. Профессиональный и вежливый тон
2. Краткость и четкость
3. Проявление заинтересованности (при положительном ответе)
4. Конкретные вопросы (при необходимости уточнений)
5. Тактичность при отказе
6. Благодарность за внимание к кандидатуре`;

      let responseInstructions = '';
      switch (context.responseType) {
        case 'positive':
          responseInstructions = 'Составь положительный ответ, выражающий заинтересованность в позиции и готовность к дальнейшему общению.';
          break;
        case 'questions':
          responseInstructions = 'Составь ответ с вопросами для уточнения деталей вакансии, условий работы или процесса отбора.';
          break;
        case 'decline':
          responseInstructions = 'Составь вежливый отказ, поблагодарив за предложение и объяснив, что в данный момент рассматриваются другие варианты.';
          break;
      }

      const userPrompt = `Составь ответ на сообщение рекрутера:

СООБЩЕНИЕ РЕКРУТЕРА:
${recruiterMessage}

КОНТЕКСТ:
Вакансия: ${context.vacancyTitle}
Компания: ${context.companyName}
Опыт кандидата: ${context.userExperience}

ЗАДАЧА: ${responseInstructions}

Ответ должен быть коротким (до 500 символов) и профессиональным.`;

      const messages: OpenAIMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ];

      const response = await this.openai.chat.completions.create({
        model: config.openai.model,
        messages,
        max_tokens: 300,
        temperature: 0.6,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      });

      const recruiterResponse = response.choices[0]?.message?.content;

      if (!recruiterResponse) {
        throw new Error('No recruiter response generated');
      }

      logger.info('Recruiter response generated successfully', {
        vacancyTitle: context.vacancyTitle,
        responseType: context.responseType,
        responseLength: recruiterResponse.length,
      });

      return recruiterResponse.trim();
    } catch (error) {
      logger.error('Failed to generate recruiter response:', error);
      throw new Error('Failed to generate recruiter response with AI');
    }
  }

  /**
   * Analyze vacancy text and extract key information
   */
  async analyzeVacancy(vacancyDescription: string): Promise<{
    keyRequirements: string[];
    mainResponsibilities: string[];
    companyBenefits: string[];
    requiredSkills: string[];
    experienceLevel: string;
    workFormat: string;
  }> {
    try {
      const systemPrompt = `Ты - аналитик вакансий, который извлекает структурированную информацию из описаний вакансий.

Твоя задача - проанализировать текст вакансии и извлечь:
1. Ключевые требования к кандидату
2. Основные обязанности
3. Преимущества работы в компании
4. Требуемые технические навыки
5. Уровень опыта (junior/middle/senior/lead)
6. Формат работы (офис/удаленка/гибрид)

Отвечай только в формате JSON без дополнительных комментариев.`;

      const userPrompt = `Проанализируй это описание вакансии:

${vacancyDescription}

Верни результат в JSON формате:
{
  "keyRequirements": ["требование1", "требование2"],
  "mainResponsibilities": ["обязанность1", "обязанность2"],
  "companyBenefits": ["преимущество1", "преимущество2"],
  "requiredSkills": ["навык1", "навык2"],
  "experienceLevel": "middle",
  "workFormat": "hybrid"
}`;

      const messages: OpenAIMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ];

      const response = await this.openai.chat.completions.create({
        model: config.openai.model,
        messages,
        max_tokens: 500,
        temperature: 0.1,
        response_format: { type: 'json_object' },
      });

      const analysisResult = response.choices[0]?.message?.content;

      if (!analysisResult) {
        throw new Error('No analysis result generated');
      }

      const parsedResult = JSON.parse(analysisResult);

      logger.info('Vacancy analysis completed successfully');

      return parsedResult;
    } catch (error) {
      logger.error('Failed to analyze vacancy:', error);
      throw new Error('Failed to analyze vacancy with AI');
    }
  }

  /**
   * Check if the model is available and working
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.openai.chat.completions.create({
        model: config.openai.model,
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 5,
      });

      return !!response.choices[0]?.message?.content;
    } catch (error) {
      logger.error('OpenAI health check failed:', error);
      return false;
    }
  }
}