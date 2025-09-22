'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'

export function HHAuthButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleAuth = async () => {
    setIsLoading(true)
    
    // Параметры для OAuth авторизации HH.ru
    const clientId = 'P1K3PIMPMND1LE14I4O0HERBV3JIF9QP24O30OO0Q2NTSMKMSVBIFJDVE2V8CL6F'
    const redirectUri = encodeURIComponent('http://localhost:3001/api/auth/hh/callback')
    const responseType = 'code'
    const state = Math.random().toString(36).substring(7) // случайный state для безопасности
    
    // Сохраняем state в localStorage для проверки
    localStorage.setItem('oauth_state', state)
    
    // Формируем URL для авторизации
    const authUrl = `https://hh.ru/oauth/authorize?` +
      `response_type=${responseType}&` +
      `client_id=${clientId}&` +
      `redirect_uri=${redirectUri}&` +
      `state=${state}`
    
    // Открываем страницу авторизации HH.ru
    window.location.href = authUrl
  }

  return (
    <Button
      onClick={handleAuth}
      disabled={isLoading}
      className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300"
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Подключение...
        </>
      ) : (
        <>
          <img src="/hh-logo.png" alt="HH.ru" className="w-5 h-5 mr-2" />
          Войти через HH.ru
          <ExternalLink className="w-4 h-4 ml-2" />
        </>
      )}
    </Button>
  )
}