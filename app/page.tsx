"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Home,
  BarChart3,
  MessageCircle,
  FileText,
  Eye,
  MessageSquare,
  Send,
  Bell,
  ExternalLink,
  X,
  Clock,
} from "lucide-react"
import { useState, useEffect } from "react"
import { apiClient, type Application, type Message } from "@/lib/api"
import { TelegramAuth } from "@/components/auth/TelegramAuth"

const StatusBadge = ({ status }: { status: string }) => {
  let bgColor = "#10b981"
  if (status === "Просмотрено") bgColor = "#8b5cf6"
  if (status === "Отправлено") bgColor = "#ec4899"

  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold"
      style={{
        backgroundColor: bgColor,
        color: "#ffffff",
        border: "none",
        boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      }}
    >
      {status}
    </span>
  )
}

const TelegramButton = () => (
  <button
    className="w-full shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-base py-5 px-4 rounded-lg flex items-center justify-center gap-2"
    style={{
      background: "linear-gradient(135deg, #8b5cf6 0%, #14b8a6 100%)",
      color: "#ffffff",
      border: "none",
    }}
  >
    <Send className="h-5 w-5" />
    Открыть в Telegram
  </button>
)

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [stats, setStats] = useState({
    total: 142,
    today: 3,
    week: 15,
    month: 67,
    statusBreakdown: {},
    responseRate: 15
  })
  const [applications, setApplications] = useState<Application[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  const metrics = [
    {
      icon: FileText,
      value: stats.today.toString(),
      label: "Откликов сегодня",
      subtitle: `${stats.week} за неделю`,
      color: "bg-chart-1",
      textColor: "!text-white",
    },
    {
      icon: BarChart3,
      value: stats.total.toString(),
      label: "Всего откликов",
      subtitle: `${stats.month} в этом месяце`,
      color: "bg-chart-2",
      textColor: "!text-white",
    },
  ]

  useEffect(() => {
    // Check for OAuth callback parameters in URL
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    const error = urlParams.get('error')
    const success = urlParams.get('success')

    if (token && success) {
      // Save token to localStorage
      localStorage.setItem('auth_token', token)
      setIsAuthenticated(true)
      
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname)
      
      // Load dashboard data
      loadDashboardData()
      return
    }

    if (error) {
      console.error('OAuth error:', error)
      // Show error to user (you can add a toast notification here)
      alert(`Ошибка авторизации: ${decodeURIComponent(error)}`)
      
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname)
    }

    // Check authentication status on component mount
    const checkAuth = () => {
      const storedToken = localStorage.getItem('auth_token')
      const isAuth = !!storedToken
      setIsAuthenticated(isAuth)
      
      if (isAuth) {
        loadDashboardData()
      } else {
        setLoading(false)
      }
    }

    const loadDashboardData = async () => {
      try {
        setLoading(true)

        const [statsResponse, applicationsResponse, messagesResponse] = await Promise.all([
          apiClient.getApplicationStats(),
          apiClient.getApplications({ limit: 10 }),
          apiClient.getMessages({ limit: 10, fromRecruiter: true })
        ])

        if (statsResponse.success) {
          setStats(statsResponse.data)
        }

        if (applicationsResponse.success) {
          setApplications(applicationsResponse.data.applications)
        }

        if (messagesResponse.success) {
          setMessages(messagesResponse.data.messages)
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Listen for authentication changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token') {
        checkAuth()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const getStatusText = (status: string) => {
    const statusMap = {
      SENT: "Отправлено",
      VIEWED: "Просмотрено", 
      RESPONDED: "Ответ получен",
      REJECTED: "Отклонено",
      INVITED: "Приглашение"
    }
    return statusMap[status as keyof typeof statusMap] || status
  }

  const getStatusIcon = (status: string) => {
    const iconMap = {
      SENT: Send,
      VIEWED: Eye,
      RESPONDED: MessageSquare,
      REJECTED: X,
      INVITED: MessageSquare
    }
    return iconMap[status as keyof typeof iconMap] || Send
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} мин назад`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} ч назад`
    } else {
      return `${Math.floor(diffInMinutes / 1440)} дн назад`
    }
  }

  const renderOverview = () => (
    <>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon
          return (
            <Card key={index} className={`${metric.color} border-0 shadow-lg overflow-hidden relative`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-2 rounded-lg bg-white/30 backdrop-blur-sm`}>
                    <IconComponent className={`h-5 w-5 ${metric.textColor}`} />
                  </div>
                </div>
                <div className={`${metric.textColor} space-y-1`}>
                  <div className="text-3xl font-bold text-balance tracking-tight">{metric.value}</div>
                  <div className="text-base font-semibold text-balance leading-tight">{metric.label}</div>
                  <div className="text-sm opacity-85 text-balance font-medium">{metric.subtitle}</div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-gradient-to-br from-purple-500/20 to-teal-500/20 rounded-lg">
            <FileText className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-balance bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
              Последние отклики
            </h2>
            <p className="text-sm text-muted-foreground">Ваша активность за сегодня</p>
          </div>
        </div>

        <div className="space-y-3">
          {loading ? (
            // Loading skeleton
            Array(3).fill(0).map((_, index) => (
              <Card key={index} className="border border-gray-200/60 shadow-md bg-white/90 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="flex justify-between">
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            applications.slice(0, 3).map((app) => {
              const IconComponent = getStatusIcon(app.status)
              return (
                <Card key={app.id} className="border border-gray-200/60 shadow-md bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 pr-2">
                        <h3 className="font-bold text-gray-900 text-balance text-base leading-tight">{app.vacancyTitle}</h3>
                        <p className="text-sm text-gray-600 text-balance font-medium">{app.companyName}</p>
                      </div>
                      <div className="p-2 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-sm flex-shrink-0">
                        <IconComponent className="h-4 w-4 text-gray-600" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <StatusBadge status={getStatusText(app.status)} />
                      <span className="text-sm text-gray-500 font-medium">{formatTimeAgo(app.appliedAt)}</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>

      <div className="mt-8">
        <Card className="border-0 bg-gradient-to-br from-purple-500/10 via-purple-400/5 to-teal-500/10 shadow-xl overflow-hidden relative">
          <CardContent className="p-5 relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-teal-500 rounded-lg shadow-lg">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-balance text-gray-900 text-base">Telegram Бот</h3>
                <p className="text-sm text-gray-600 text-balance font-medium">Управляйте поиском через ИИ-бота</p>
              </div>
            </div>
            <TelegramButton />
          </CardContent>
        </Card>
      </div>
    </>
  )

  const renderApplications = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-gradient-to-br from-purple-100 to-teal-100 rounded-lg">
          <BarChart3 className="h-5 w-5 text-purple-600" />
        </div>
        <h2 className="text-lg font-semibold text-balance text-gray-900">Все отклики</h2>
      </div>

      <div className="space-y-3">
        {applications.map((app, index) => {
          const IconComponent = app.icon
          return (
            <Card key={index} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 pr-2">
                    <h3 className="font-semibold text-gray-900 text-balance text-base leading-tight">{app.title}</h3>
                    <p className="text-sm text-gray-600 text-balance">{app.company}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-medium text-green-600">{app.salary}</span>
                      <span className="text-sm text-gray-500">• {app.location}</span>
                    </div>
                  </div>
                  <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                    <IconComponent className="h-4 w-4 text-gray-600" />
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3 text-balance leading-relaxed">{app.description}</p>

                <div className="flex items-center justify-between mb-3">
                  <StatusBadge status={app.status} />
                  <span className="text-xs text-gray-500">{app.time}</span>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    size="default"
                    className="flex-1 text-base py-3 px-4 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                    style={{
                      background: "linear-gradient(135deg, #8b5cf6 0%, #14b8a6 100%)",
                      border: "none",
                    }}
                  >
                    <ExternalLink className="h-5 w-5 mr-2" />
                    Открыть на hh.ru
                  </Button>
                  <Button
                    variant="ghost"
                    size="default"
                    className="text-gray-500 hover:text-gray-600 hover:bg-gray-50 text-base py-3 px-4 font-normal"
                  >
                    <X className="h-5 w-5 mr-2" />
                    Не откликаться на похожие
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )

  const handleTelegramAuth = (token: string) => {
    localStorage.setItem('auth_token', token)
    setIsAuthenticated(true)
    loadDashboardData()
  }

  const renderAuth = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-teal-500 rounded-full flex items-center justify-center shadow-2xl mb-6 mx-auto">
          <img src="/jobora-logo.jpg" alt="Jobora" className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-balance bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent mb-4">
          Добро пожаловать в Jobora!
        </h1>
        <p className="text-gray-600 text-balance text-lg mb-2">
          ИИ-помощник для автоматизации поиска работы
        </p>
        <p className="text-gray-500 text-balance mb-8">
          Войдите через Telegram бот для начала работы
        </p>
      </div>

      <div className="w-full max-w-md space-y-4">
        <Card className="border-2 border-blue-200/50 shadow-xl bg-gradient-to-br from-white to-blue-50/30">
          <CardContent className="p-6">
            <TelegramAuth onAuth={handleTelegramAuth} />
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-md bg-white">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Что умеет Jobora:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                Автоматический поиск подходящих вакансий на HH.ru
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                ИИ-генерация персональных сопроводительных писем
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                Полное управление через Telegram-бота
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                Отслеживание статуса откликов и ответов
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderMessages = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-gradient-to-br from-purple-100 to-teal-100 rounded-lg">
          <MessageCircle className="h-5 w-5 text-purple-600" />
        </div>
        <h2 className="text-lg font-semibold text-balance text-gray-900">Сообщения от рекрутеров</h2>
      </div>

      <div className="space-y-3">
        {loading ? (
          // Loading skeleton
          Array(3).fill(0).map((_, index) => (
            <Card key={index} className="border border-gray-200 shadow-sm bg-white">
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="flex justify-between mb-3">
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-24 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-28"></div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="h-16 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : messages.length > 0 ? (
          messages.map((msg) => (
            <Card
              key={msg.id}
              className={`border shadow-sm hover:shadow-md transition-shadow bg-white ${
                !msg.isRead ? "border-purple-200 bg-purple-50/30" : "border-gray-200"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 pr-2">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 text-balance text-base">
                        {msg.recruiterName || 'Рекрутер'}
                      </h3>
                      {!msg.isRead && <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>}
                    </div>
                    <p className="text-sm text-gray-600 text-balance">
                      {msg.application?.companyName || 'Компания'}
                    </p>
                    <p className="text-xs text-purple-600 text-balance">
                      {msg.application?.vacancyTitle || 'Вакансия'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                    <Clock className="h-3 w-3" />
                    {formatTimeAgo(msg.createdAt)}
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-4 text-balance leading-relaxed">
                  {msg.content}
                </p>

                <Button
                  className="w-full text-base py-3 px-4"
                  style={{
                    background: "linear-gradient(to right, #8b5cf6, #14b8a6)",
                    color: "#ffffff",
                    border: "none",
                  }}
                  size="default"
                  onClick={() => {
                    if (!msg.isRead) {
                      apiClient.markMessageRead(msg.id)
                    }
                  }}
                >
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Ответить в hh.ru
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Нет сообщений</h3>
              <p className="text-gray-600">Когда рекрутеры ответят на ваши отклики, сообщения появятся здесь</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-lg">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
              <img src="/jobora-logo.jpg" alt="Jobora" className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-balance bg-gradient-to-r from-purple-600 via-purple-500 to-teal-600 bg-clip-text text-transparent">
                Jobora
              </h1>
              <p className="text-xs text-gray-600 font-medium">ИИ Помощник по поиску работы</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative hover:bg-purple-100/50 transition-colors h-9 w-9">
              <Bell className="h-4 w-4 text-gray-700" />
              <span
                className="absolute -top-1 -right-1 h-4 w-4 rounded-full text-[10px] flex items-center justify-center font-bold shadow-lg bg-purple-500 text-white border-2 border-white"
                style={{
                  background: "linear-gradient(135deg, #14b8a6, #8b5cf6) !important",
                  color: "#ffffff !important",
                  border: "2px solid white !important",
                  backgroundColor: "#8b5cf6 !important",
                }}
              >
                2
              </span>
            </Button>
            <Avatar className="h-8 w-8 shadow-lg ring-2 ring-purple-200">
              <AvatarImage src="/diverse-user-avatars.png" />
              <AvatarFallback className="bg-gradient-to-br from-purple-100 to-teal-100 text-purple-700 font-bold text-xs">
                ИП
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="p-4 pb-20">
        {!isAuthenticated ? (
          renderAuth()
        ) : (
          <>
            {activeTab === "overview" && renderOverview()}
            {activeTab === "applications" && renderApplications()}
            {activeTab === "messages" && renderMessages()}
          </>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl">
        <div className="grid grid-cols-3 gap-1 p-2">
          {[
            { icon: Home, label: "Обзор", key: "overview" },
            { icon: BarChart3, label: "Отклики", key: "applications" },
            { icon: MessageCircle, label: "Сообщения", key: "messages" },
          ].map((item, index) => {
            const IconComponent = item.icon
            const isActive = activeTab === item.key
            return (
              <Button
                key={index}
                variant="ghost"
                onClick={() => setActiveTab(item.key)}
                className={`flex flex-col items-center gap-1 h-auto py-3 px-2 transition-all duration-300 ${
                  isActive
                    ? "text-purple-600 bg-gradient-to-br from-purple-100/80 to-teal-100/80 shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
                }`}
              >
                <IconComponent className="h-5 w-5" />
                <span className="text-sm font-semibold">{item.label}</span>
              </Button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
