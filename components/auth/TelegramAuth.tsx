'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { MessageSquare, CheckCircle, Copy } from 'lucide-react'

export function TelegramAuth({ onAuth }: { onAuth: (token: string) => void }) {
  const [botStarted, setBotStarted] = useState(false)
  const [authCode, setAuthCode] = useState<string | null>(null)
  const [isWaiting, setIsWaiting] = useState(false)

  const BOT_USERNAME = 'jobora_bot'
  const BOT_TOKEN = '7962185948:AAFO155wgVX6fPA8bVJInAmUGSpSP_8hiGg'

  useEffect(() => {
    // Генерируем уникальный код авторизации
    if (!authCode) {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase()
      setAuthCode(code)
    }
  }, [authCode])

  const handleStartBot = async () => {
    setIsWaiting(true)
    setBotStarted(true)

    // Открываем бот в Telegram
    const telegramUrl = `https://t.me/${BOT_USERNAME}?start=${authCode}`
    window.open(telegramUrl, '_blank')

    // Начинаем проверять авторизацию каждые 3 секунды
    const checkAuth = setInterval(async () => {
      try {
        const response = await fetch(`/api/auth/telegram/check?code=${authCode}`)
        const data = await response.json()
        
        if (data.success && data.token) {
          clearInterval(checkAuth)
          setIsWaiting(false)
          onAuth(data.token)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      }
    }, 3000)

    // Останавливаем проверку через 5 минут
    setTimeout(() => {
      clearInterval(checkAuth)
      setIsWaiting(false)
    }, 300000) // 5 минут
  }

  const copyAuthCode = () => {
    if (authCode) {
      navigator.clipboard.writeText(authCode)
    }
  }

  return (
    <div className="space-y-6">
      {!botStarted ? (
        <>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl mb-4 mx-auto">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Авторизация через Telegram
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Используйте Telegram бот для безопасного входа в приложение
            </p>
          </div>

          <Button
            onClick={handleStartBot}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300"
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            Начать авторизацию
          </Button>
        </>
      ) : (
        <>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-xl mb-4 mx-auto">
              {isWaiting ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              ) : (
                <CheckCircle className="w-8 h-8 text-white" />
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {isWaiting ? 'Ожидание авторизации...' : 'Готово!'}
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              {isWaiting 
                ? 'Подтвердите авторизацию в Telegram боте' 
                : 'Авторизация завершена'}
            </p>
          </div>

          {authCode && (
            <div className="bg-gray-50 rounded-lg p-4 border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Код авторизации:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyAuthCode}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <div className="font-mono text-lg font-bold text-center bg-white rounded p-3 border">
                {authCode}
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Отправьте этот код боту, если потребуется
              </p>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              <strong>Инструкция:</strong>
            </p>
            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
              <li>Бот должен открыться автоматически</li>
              <li>Нажмите /start или отправьте код авторизации</li>
              <li>Подтвердите авторизацию в боте</li>
              <li>Дождитесь автоматического входа в приложение</li>
            </ol>
          </div>

          {isWaiting && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  setBotStarted(false)
                  setIsWaiting(false)
                  setAuthCode(null)
                }}
              >
                Начать заново
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}