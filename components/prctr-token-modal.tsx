"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const Token = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="8" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    <path d="M2 12h20" />
  </svg>
)

const Coins = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="8" cy="8" r="6" />
    <path d="m16 16 6-6" />
    <circle cx="16" cy="16" r="6" />
  </svg>
)

const TrendingUp = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
    <polyline points="17,6 23,6 23,12" />
  </svg>
)

const Gift = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="8" width="18" height="4" rx="1" />
    <path d="m12 8-4-4h8l-4 4" />
    <path d="M12 12v9" />
  </svg>
)

interface PrctrTokenModalProps {
  isOpen: boolean
  onClose: () => void
  currentBalance: number
}

export function PrctrTokenModal({ isOpen, onClose, currentBalance }: PrctrTokenModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background border-2 border-border rounded-2xl p-0 overflow-hidden">
        <div className="p-6">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Token className="w-6 h-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-foreground">PRCTR Token</DialogTitle>
                <p className="text-sm text-muted-foreground">Predictr Platform Token</p>
              </div>
            </div>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            {/* Current Balance */}
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Coins className="w-5 h-5 text-primary" />
                  <span className="font-medium text-primary">Your Balance</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground">{currentBalance.toLocaleString()} PRCTR</h3>
              </div>
            </div>

            {/* Token Information */}
            <div className="space-y-3">
              <div className="bg-muted/50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-success" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Coming Soon</h4>
                    <p className="text-sm text-muted-foreground">
                      PRCTR is our upcoming platform token that will be officially launched soon. Get ready for exciting
                      utility features!
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
                    <Gift className="w-4 h-4 text-warning" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Earn Tokens</h4>
                    <p className="text-sm text-muted-foreground">
                      You're currently earning PRCTR tokens for your activity on the platform. Keep making predictions
                      and participating to earn more!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* How to Earn More */}
            <div className="bg-accent/50 rounded-xl p-4">
              <h4 className="font-semibold text-foreground mb-3">How to Earn More PRCTR</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  Make accurate predictions on startups
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  Participate in prediction markets
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  Engage with the community
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  Complete daily challenges
                </li>
              </ul>
            </div>

            <Button
              onClick={onClose}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg py-3 font-semibold"
            >
              Got it!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
