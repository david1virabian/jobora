"use client"

import { useState, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { Startup } from "@/lib/mock-data"
import { useRouter } from "next/navigation"

const TrendingUp = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
    <polyline points="17,6 23,6 23,12" />
  </svg>
)

const TrendingDown = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="23,18 13.5,8.5 8.5,13.5 1,6" />
    <polyline points="17,18 23,18 23,12" />
  </svg>
)

const X = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="m18 6-12 12" />
    <path d="m6 6 12 12" />
  </svg>
)

const Wallet = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M19 7V6a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1v2a1 1 0 0 0 1 1h1a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-1Z" />
    <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 1 1-1v-4a1 1 0 0 1-1-1H5a2 2 0 0 1 0-4h15a1 1 0 0 1 1-1V6a1 1 0 0 1-1-1H5a2 2 0 0 0-2 2Z" />
    <circle cx="12" cy="12" r="2" />
  </svg>
)

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22,4 12,14.01 9,11.01" />
  </svg>
)

interface ForecastModalProps {
  isOpen: boolean
  onClose: () => void
  startup: Startup
  forecastType: "increase" | "decrease" | null
}

export function ForecastModal({ isOpen, onClose, startup, forecastType }: ForecastModalProps) {
  const [amount, setAmount] = useState("")
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()

  const handleAmountSelect = (value: string) => {
    setSelectedAmount(value)
    setAmount(value)
  }

  const connectMetaMask = useCallback(async () => {
    if (isConnecting) return

    setIsConnecting(true)
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        if (accounts.length > 0) {
          setWalletAddress(accounts[0])
          setIsConnected(true)
        }
      } else {
        alert("MetaMask is not installed. Please install MetaMask to continue.")
      }
    } catch (error) {
      console.error("Failed to connect MetaMask:", error)
    } finally {
      setIsConnecting(false)
    }
  }, [isConnecting])

  const connectTrustWallet = useCallback(async () => {
    if (isConnecting) return

    setIsConnecting(true)
    try {
      if (typeof window !== "undefined" && window.ethereum && window.ethereum.isTrust) {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        if (accounts.length > 0) {
          setWalletAddress(accounts[0])
          setIsConnected(true)
        }
      } else {
        alert("Trust Wallet is not installed. Please install Trust Wallet to continue.")
      }
    } catch (error) {
      console.error("Failed to connect Trust Wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }, [isConnecting])

  const connectWalletConnect = useCallback(async () => {
    if (isConnecting) return

    setIsConnecting(true)
    try {
      await new Promise<void>((resolve) => {
        const timer = setTimeout(() => {
          const mockAddress = "0x742d35Cc6634C0532925a3b8D4C9db96590b5b8e"
          setWalletAddress(mockAddress)
          setIsConnected(true)
          resolve()
        }, 1500)

        return () => clearTimeout(timer)
      })
    } catch (error) {
      console.error("Failed to connect WalletConnect:", error)
    } finally {
      setIsConnecting(false)
    }
  }, [isConnecting])

  const handleMakeForecast = () => {
    if (!isConnected) {
      return
    }

    console.log(
      `Making ${forecastType} forecast for ${startup.name} with amount: $${amount} from wallet: ${walletAddress}`,
    )
    setShowSuccess(true)
  }

  const handleGoToMyForecasts = () => {
    router.push("/forecasts")
    handleCloseModal()
  }

  const handleCloseModal = () => {
    onClose()
    setAmount("")
    setSelectedAmount(null)
    setShowSuccess(false)
  }

  const isIncrease = forecastType === "increase"

  if (!forecastType) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="sm:max-w-md bg-white border-2 border-black rounded-2xl p-0 overflow-hidden">
        <div className="p-6">
          {showSuccess ? (
            <>
              <DialogHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-bold text-gray-900">Forecast Placed!</DialogTitle>
                      <p className="text-sm text-gray-600">Your prediction has been recorded</p>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="mt-6 space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="text-center">
                    <h3 className="font-semibold text-green-900 mb-2">
                      ${amount} forecast placed on {startup.name}
                    </h3>
                    <p className="text-sm text-green-800">
                      You predicted the startup will {forecastType === "increase" ? "succeed" : "fail"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleGoToMyForecasts}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-semibold"
                  >
                    View My Forecasts
                  </Button>
                  <Button
                    onClick={handleCloseModal}
                    variant="outline"
                    className="flex-1 border-2 border-gray-200 hover:border-gray-300 rounded-lg py-3 font-semibold bg-transparent"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <DialogHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
                      <img
                        src={startup.logoUrl || "/placeholder.svg?height=48&width=48&query=startup logo"}
                        alt={startup.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-bold text-gray-900">{startup.name}</DialogTitle>
                      <p className="text-sm text-gray-600">{startup.oneLiner}</p>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="mt-6 space-y-4">
                {!isConnected ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Wallet className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Connect Wallet to Place Bet</span>
                    </div>
                    <p className="text-sm text-blue-800 mb-4">
                      Connect your wallet to place real forecasts and participate in the prediction market.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={connectMetaMask}
                        disabled={isConnecting}
                        className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
                      >
                        {isConnecting ? "Connecting..." : "MetaMask"}
                      </Button>
                      <Button
                        onClick={connectTrustWallet}
                        disabled={isConnecting}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                      >
                        {isConnecting ? "Connecting..." : "Trust Wallet"}
                      </Button>
                      <Button
                        onClick={connectWalletConnect}
                        disabled={isConnecting}
                        className="col-span-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                      >
                        {isConnecting ? "Connecting..." : "WalletConnect"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Wallet className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-900">Wallet Connected</span>
                    </div>
                    <p className="text-sm text-green-800">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    {isIncrease ? (
                      <>
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        Forecast Success
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-5 h-5 text-blue-600" />
                        Forecast Fail
                      </>
                    )}
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Forecast Amount</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <Input
                          type="number"
                          placeholder="Enter amount..."
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="pl-8 border-2 border-gray-200 rounded-lg focus:border-blue-500"
                          disabled={!isConnected}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Range: $1 - $10K</p>
                    </div>

                    <div className="flex gap-2">
                      {["10", "50", "100", "500"].map((value) => (
                        <Button
                          key={value}
                          variant="outline"
                          size="sm"
                          disabled={!isConnected}
                          className={cn(
                            "rounded-lg border-2 font-medium",
                            selectedAmount === value
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-200 hover:border-gray-300",
                          )}
                          onClick={() => handleAmountSelect(value)}
                        >
                          ${value}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleMakeForecast}
                  disabled={!isConnected || !amount || Number(amount) < 1 || Number(amount) > 10000}
                  className={cn(
                    "w-full rounded-lg py-3 font-semibold text-white transition-all duration-200",
                    isIncrease
                      ? "bg-green-600 hover:bg-green-700 disabled:bg-gray-300"
                      : "bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300",
                  )}
                >
                  {isConnected ? "Place Forecast" : "Connect Wallet to Forecast"}
                </Button>

                {isConnected && (
                  <p className="text-xs text-gray-500 text-center">
                    Real money will be used for this forecast. Make sure you understand the risks.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
