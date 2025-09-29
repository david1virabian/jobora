"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface WalletConnectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConnect?: (walletName: string) => void
}

const wallets = [
  {
    name: "MetaMask",
    icon: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
    description: "Connect using browser wallet",
  },
  {
    name: "WalletConnect",
    icon: "https://docs.walletconnect.com/assets/walletconnect-logo.svg",
    description: "Scan with WalletConnect to connect",
  },
  {
    name: "Coinbase Wallet",
    icon: "https://images.ctfassets.net/q5ulk4bp65r7/3TBS4oVkD1ghowTqVQJlqj/2dfd4ea3b623a7c0d8deb2ff445dee9e/Consumer_Wordmark_White_RGB.svg",
    description: "Connect using Coinbase Wallet",
  },
  {
    name: "Trust Wallet",
    icon: "https://trustwallet.com/assets/images/media/assets/trust_platform.svg",
    description: "Connect using Trust Wallet",
  },
]

export function WalletConnector({ open, onOpenChange, onConnect }: WalletConnectorProps) {
  const [connecting, setConnecting] = useState<string | null>(null)

  const handleConnect = async (walletName: string) => {
    setConnecting(walletName)

    // Simulate connection process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log(`[v0] Connecting to ${walletName}`)
    setConnecting(null)
    onOpenChange(false)
    onConnect?.(walletName)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">Connect Wallet</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground text-center">
            Choose your preferred wallet to connect to Predictr
          </p>

          <Separator />

          <div className="space-y-3">
            {wallets.map((wallet) => (
              <Button
                key={wallet.name}
                variant="outline"
                className="w-full h-16 justify-start space-x-4 hover:bg-accent/50 transition-all duration-200 bg-transparent"
                onClick={() => handleConnect(wallet.name)}
                disabled={connecting !== null}
              >
                <img
                  src={wallet.icon || "/placeholder.svg"}
                  alt={wallet.name}
                  className="h-8 w-8"
                  onError={(e) => {
                    // Fallback to a generic wallet icon if image fails
                    e.currentTarget.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'%3E%3C/path%3E%3C/svg%3E"
                  }}
                />
                <div className="flex-1 text-left">
                  <div className="font-medium">{connecting === wallet.name ? "Connecting..." : wallet.name}</div>
                  <div className="text-sm text-muted-foreground">{wallet.description}</div>
                </div>
                {connecting === wallet.name && (
                  <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                )}
              </Button>
            ))}
          </div>

          <Separator />

          <p className="text-xs text-muted-foreground text-center">
            By connecting a wallet, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
