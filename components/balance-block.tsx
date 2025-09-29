"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Wallet, Plus, CreditCard, ArrowDownLeft, Shield, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { WalletConnector } from "./wallet-connector"

export function BalanceBlock() {
  const [balance, setBalance] = useState(2847.5)
  const [topUpAmount, setTopUpAmount] = useState("")
  const [showWalletConnector, setShowWalletConnector] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [connectedWallet, setConnectedWallet] = useState("")

  // Withdrawal states
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false)
  const [withdrawalAmount, setWithdrawalAmount] = useState("")
  const [selectedBlockchain, setSelectedBlockchain] = useState("")
  const [selectedToken, setSelectedToken] = useState("")
  const [withdrawalAddress, setWithdrawalAddress] = useState("")
  const [withdrawalStep, setWithdrawalStep] = useState<"form" | "confirm" | "processing" | "success">("form")
  const [isProcessingWithdrawal, setIsProcessingWithdrawal] = useState(false)

  const blockchains = [
    {
      id: "ethereum",
      name: "Ethereum",
      tokens: [
        { id: "eth", name: "Ethereum (ETH)", fee: "0.005 ETH" },
        { id: "usdc", name: "USD Coin (USDC)", fee: "5 USDC" },
        { id: "usdt", name: "Tether (USDT)", fee: "5 USDT" },
      ],
    },
    {
      id: "bitcoin",
      name: "Bitcoin",
      tokens: [{ id: "btc", name: "Bitcoin (BTC)", fee: "0.0001 BTC" }],
    },
    {
      id: "polygon",
      name: "Polygon",
      tokens: [
        { id: "matic", name: "Polygon (MATIC)", fee: "0.1 MATIC" },
        { id: "usdc-poly", name: "USD Coin (USDC)", fee: "1 USDC" },
      ],
    },
    {
      id: "bsc",
      name: "Binance Smart Chain",
      tokens: [
        { id: "bnb", name: "BNB", fee: "0.001 BNB" },
        { id: "busd", name: "Binance USD (BUSD)", fee: "1 BUSD" },
      ],
    },
  ]

  const getAvailableTokens = () => {
    const blockchain = blockchains.find((b) => b.id === selectedBlockchain)
    return blockchain ? blockchain.tokens : []
  }

  const getSelectedTokenInfo = () => {
    const tokens = getAvailableTokens()
    return tokens.find((t) => t.id === selectedToken)
  }

  const handleTopUp = () => {
    if (!isConnected) {
      setShowWalletConnector(true)
      return
    }

    const amount = Number.parseFloat(topUpAmount)
    if (amount > 0) {
      setBalance((prev) => prev + amount)
      setTopUpAmount("")
    }
  }

  const handleWalletConnect = (walletName: string) => {
    setIsConnected(true)
    setConnectedWallet(walletName)
    setShowWalletConnector(false)
  }

  const handleWithdrawalSubmit = () => {
    const amount = Number.parseFloat(withdrawalAmount)
    if (amount > 0 && amount <= balance && selectedBlockchain && selectedToken && withdrawalAddress) {
      setWithdrawalStep("confirm")
    }
  }

  const confirmWithdrawal = () => {
    setWithdrawalStep("processing")
    setIsProcessingWithdrawal(true)

    // Simulate processing time
    setTimeout(() => {
      const amount = Number.parseFloat(withdrawalAmount)
      setBalance((prev) => prev - amount)
      setWithdrawalStep("success")
      setIsProcessingWithdrawal(false)
    }, 3000)
  }

  const resetWithdrawal = () => {
    setShowWithdrawalModal(false)
    setWithdrawalAmount("")
    setSelectedBlockchain("")
    setSelectedToken("")
    setWithdrawalAddress("")
    setWithdrawalStep("form")
    setIsProcessingWithdrawal(false)
  }

  const quickAmounts = [50, 100, 250, 500]

  const canWithdraw =
    isConnected &&
    balance > 0 &&
    Number.parseFloat(topUpAmount || "0") > 0 &&
    Number.parseFloat(topUpAmount || "0") <= balance

  return (
    <>
      <Card className="bg-gradient-to-br from-primary/10 to-primary/20 border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300 max-w-4xl mx-auto">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-center gap-3">
            <div className="p-3 rounded-xl bg-primary/20">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            Account Balance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="text-center">
            <p className="text-base font-medium text-muted-foreground uppercase tracking-wide mb-4">
              Available Balance
            </p>
            <p className="text-6xl font-bold text-foreground mb-2">${balance.toFixed(1)}</p>
            {isConnected && (
              <p className="text-base text-muted-foreground mt-4 flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Connected to {connectedWallet}
              </p>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="number"
                placeholder="Enter amount"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                className="flex-1 h-12 text-lg"
                min="0"
                step="0.01"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleTopUp}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 h-12"
                >
                  {isConnected ? (
                    <>
                      <Plus className="h-5 w-5" />
                      Top Up
                    </>
                  ) : (
                    <>
                      <Wallet className="h-5 w-5" />
                      Connect & Top Up
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setWithdrawalAmount(topUpAmount)
                    setShowWithdrawalModal(true)
                  }}
                  variant="outline"
                  size="lg"
                  disabled={!canWithdraw}
                  className="font-semibold px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 h-12 border-2 hover:bg-destructive/10 hover:border-destructive/30"
                >
                  <ArrowDownLeft className="h-5 w-5" />
                  Withdraw
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="lg"
                  onClick={() => setTopUpAmount(amount.toString())}
                  className="font-medium hover:bg-primary/10 hover:border-primary/30 transition-all duration-200 h-12"
                >
                  ${amount}
                </Button>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 text-base text-muted-foreground">
              <CreditCard className="h-5 w-5" />
              <span>Secure payments via blockchain wallet</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawal Modal */}
      <Dialog open={showWithdrawalModal} onOpenChange={setShowWithdrawalModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowDownLeft className="h-5 w-5" />
              {withdrawalStep === "form" && "Withdraw Funds"}
              {withdrawalStep === "confirm" && "Confirm Withdrawal"}
              {withdrawalStep === "processing" && "Processing Withdrawal"}
              {withdrawalStep === "success" && "Withdrawal Successful"}
            </DialogTitle>
            <DialogDescription>
              {withdrawalStep === "form" && "Choose your blockchain, token, and enter withdrawal details."}
              {withdrawalStep === "confirm" && "Please review your withdrawal details before confirming."}
              {withdrawalStep === "processing" && "Your withdrawal is being processed. This may take a few minutes."}
              {withdrawalStep === "success" && "Your withdrawal has been successfully initiated."}
            </DialogDescription>
          </DialogHeader>

          {withdrawalStep === "form" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="withdrawal-amount">Amount to Withdraw</Label>
                <Input
                  id="withdrawal-amount"
                  type="number"
                  placeholder="0.00"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  max={balance}
                  min="0"
                  step="0.01"
                />
                <p className="text-sm text-muted-foreground">Available balance: ${balance.toFixed(2)}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="blockchain">Blockchain Network</Label>
                <Select
                  value={selectedBlockchain}
                  onValueChange={(value) => {
                    setSelectedBlockchain(value)
                    setSelectedToken("") // Reset token when blockchain changes
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select blockchain network" />
                  </SelectTrigger>
                  <SelectContent>
                    {blockchains.map((blockchain) => (
                      <SelectItem key={blockchain.id} value={blockchain.id}>
                        {blockchain.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedBlockchain && (
                <div className="space-y-2">
                  <Label htmlFor="token">Token</Label>
                  <Select value={selectedToken} onValueChange={setSelectedToken}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableTokens().map((token) => (
                        <SelectItem key={token.id} value={token.id}>
                          <div className="flex justify-between items-center w-full">
                            <span>{token.name}</span>
                            <span className="text-sm text-muted-foreground ml-2">Fee: {token.fee}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedToken && (
                <div className="space-y-2">
                  <Label htmlFor="withdrawal-address">
                    Wallet Address ({blockchains.find((b) => b.id === selectedBlockchain)?.name})
                  </Label>
                  <Input
                    id="withdrawal-address"
                    placeholder={`Enter your ${blockchains.find((b) => b.id === selectedBlockchain)?.name} wallet address`}
                    value={withdrawalAddress}
                    onChange={(e) => setWithdrawalAddress(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Make sure this address supports {getSelectedTokenInfo()?.name} on{" "}
                    {blockchains.find((b) => b.id === selectedBlockchain)?.name}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Shield className="h-4 w-4 text-primary" />
                <p className="text-sm text-muted-foreground">
                  All withdrawals are secured and processed within 24 hours.
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={resetWithdrawal} className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button
                  onClick={handleWithdrawalSubmit}
                  disabled={
                    !withdrawalAmount ||
                    !selectedBlockchain ||
                    !selectedToken ||
                    !withdrawalAddress ||
                    Number.parseFloat(withdrawalAmount) > balance
                  }
                  className="flex-1"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {withdrawalStep === "confirm" && (
            <div className="space-y-4">
              <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Amount:</span>
                  <span className="text-sm font-bold">${withdrawalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Blockchain:</span>
                  <span className="text-sm">{blockchains.find((b) => b.id === selectedBlockchain)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Token:</span>
                  <span className="text-sm">{getSelectedTokenInfo()?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Fee:</span>
                  <span className="text-sm">{getSelectedTokenInfo()?.fee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Address:</span>
                  <span className="text-sm font-mono text-xs">
                    {withdrawalAddress.length > 20
                      ? `${withdrawalAddress.slice(0, 10)}...${withdrawalAddress.slice(-10)}`
                      : withdrawalAddress}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Please double-check all details. Withdrawals cannot be reversed.
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setWithdrawalStep("form")} className="flex-1">
                  Back
                </Button>
                <Button onClick={confirmWithdrawal} className="flex-1">
                  Confirm Withdrawal
                </Button>
              </div>
            </div>
          )}

          {withdrawalStep === "processing" && (
            <div className="space-y-4 text-center py-8">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
              <div className="space-y-2">
                <p className="font-medium">Processing your withdrawal...</p>
                <p className="text-sm text-muted-foreground">
                  This usually takes 2-5 minutes. Please don't close this window.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Estimated completion: 3-5 minutes</span>
              </div>
            </div>
          )}

          {withdrawalStep === "success" && (
            <div className="space-y-4 text-center py-8">
              <div className="flex justify-center">
                <div className="p-3 rounded-full bg-green-500/10">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-green-600">Withdrawal Initiated Successfully!</p>
                <p className="text-sm text-muted-foreground">
                  Your withdrawal of ${withdrawalAmount} has been submitted and will be processed within 24 hours.
                </p>
              </div>
              <Button onClick={resetWithdrawal} className="w-full">
                Done
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <WalletConnector
        open={showWalletConnector}
        onOpenChange={setShowWalletConnector}
        onConnect={handleWalletConnect}
      />
    </>
  )
}
