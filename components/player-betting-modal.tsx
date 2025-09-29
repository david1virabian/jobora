"use client"

import { useState, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TrendingUp, Wallet, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface BettingCard {
  id: string
  prediction: string
  probability: number
  description: string
  player: string
}

interface PlayerBettingModalProps {
  isOpen: boolean
  onClose: () => void
  bettingCard: BettingCard | null
  betType: "yes" | "no" | null
}

export function PlayerBettingModal({ isOpen, onClose, bettingCard, betType }: PlayerBettingModalProps) {
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

  const handlePlaceBet = () => {
    if (!isConnected || !bettingCard) {
      return
    }

    console.log(
      `Placing ${betType} bet on ${bettingCard.player} for "${bettingCard.prediction}" with amount: $${amount} from wallet: ${walletAddress}`,
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

  if (!bettingCard || !betType) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="sm:max-w-md bg-background border-2 border-border rounded-2xl p-0 overflow-hidden">
        <div className="p-6">
          {showSuccess ? (
            <>
              <DialogHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-bold text-foreground">Bet Placed!</DialogTitle>
                      <p className="text-sm text-muted-foreground">Your prediction has been recorded</p>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="mt-6 space-y-4">
                <div className="bg-success/10 border border-success/20 rounded-xl p-4">
                  <div className="text-center">
                    <h3 className="font-semibold text-success mb-2">
                      ${amount} bet placed on {bettingCard.player}
                    </h3>
                    <p className="text-sm text-success/80">
                      You bet "{betType.toUpperCase()}" on: {bettingCard.prediction}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleGoToMyForecasts}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg py-3 font-semibold"
                  >
                    View My Forecasts
                  </Button>
                  <Button
                    onClick={handleCloseModal}
                    variant="outline"
                    className="flex-1 border-2 border-border hover:border-border/80 rounded-lg py-3 font-semibold bg-transparent"
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
                  <div className="flex-1">
                    <DialogTitle className="text-xl font-bold text-foreground">{bettingCard.player}</DialogTitle>
                    <p className="text-sm text-muted-foreground">{bettingCard.prediction}</p>
                  </div>
                </div>
              </DialogHeader>

              <div className="mt-6 space-y-4">
                {!isConnected ? (
                  <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Wallet className="w-5 h-5 text-primary" />
                      <span className="font-medium text-primary">Connect Wallet to Place Bet</span>
                    </div>
                    <p className="text-sm text-primary/80 mb-4">
                      Connect your wallet to place real forecasts and participate in the prediction market.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={connectMetaMask}
                        disabled={isConnecting}
                        className="bg-warning hover:bg-warning/90 text-warning-foreground rounded-lg"
                      >
                        {isConnecting ? "Connecting..." : "MetaMask"}
                      </Button>
                      <Button
                        onClick={connectTrustWallet}
                        disabled={isConnecting}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
                      >
                        {isConnecting ? "Connecting..." : "Trust Wallet"}
                      </Button>
                      <Button
                        onClick={connectWalletConnect}
                        disabled={isConnecting}
                        className="col-span-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg"
                      >
                        {isConnecting ? "Connecting..." : "WalletConnect"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-success/10 border border-success/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Wallet className="w-5 h-5 text-success" />
                      <span className="font-medium text-success">Wallet Connected</span>
                    </div>
                    <p className="text-sm text-success/80">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-success" />
                    Forecast Success
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Forecast Amount</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                          $
                        </span>
                        <Input
                          type="number"
                          placeholder="Enter amount..."
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="pl-8 border-2 border-border rounded-lg focus:border-primary"
                          disabled={!isConnected}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Range: $1 - $10K</p>
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
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-border/80",
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
                  onClick={handlePlaceBet}
                  disabled={!isConnected || !amount || Number(amount) < 1 || Number(amount) > 10000}
                  className="w-full bg-success hover:bg-success/90 disabled:bg-muted disabled:text-muted-foreground rounded-lg py-3 font-semibold text-success-foreground transition-all duration-200"
                >
                  {isConnected ? "Place Forecast" : "Connect Wallet to Forecast"}
                </Button>

                {isConnected && (
                  <p className="text-xs text-muted-foreground text-center">
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
