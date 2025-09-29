"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { PrctrTokenModal } from "@/components/prctr-token-modal"
import { UnderDevelopmentModal } from "@/components/under-development-modal"
import { useState } from "react"

// Inline SVG components
const User = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const Menu = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

const Wallet = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
  </svg>
)

const Token = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="8" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    <path d="M2 12h20" />
  </svg>
)

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPrctrModalOpen, setIsPrctrModalOpen] = useState(false)
  const [isUnderDevModalOpen, setIsUnderDevModalOpen] = useState(false)
  const userBalance = 2847.5 // Mock user balance
  const prctrBalance = 1250.75 // Mock PRCTR token balance

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-all duration-200 hover:scale-105"
          >
            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
              <svg className="h-4 w-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="font-bold text-xl text-foreground">Predictr</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="flex items-center space-x-4">
            <Link href="/leaderboard">
              <Button
                variant="ghost"
                className="hidden md:flex text-sm font-medium text-foreground hover:text-foreground hover:bg-accent/60 transition-all duration-500 ease-out relative group overflow-hidden rounded-lg"
              >
                <span className="relative z-10">Leaderboard</span>
                <span className="absolute inset-0 bg-accent/40 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out rounded-lg"></span>
                <span className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-foreground/60 transition-all duration-400 ease-out group-hover:w-4/5 group-hover:left-[10%] rounded-full"></span>
              </Button>
            </Link>

            <div className="hidden md:flex items-center space-x-2">
              <Link href="/forecasts">
                <Button className="text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg hover:shadow-primary/25">
                  <Wallet className="mr-2 h-4 w-4" />${userBalance.toLocaleString()}
                </Button>
              </Link>
              <Button
                variant="outline"
                className="text-sm font-medium border-primary/30 text-primary hover:bg-primary/10 transition-all duration-300 ease-out hover:scale-105 bg-transparent"
                onClick={() => setIsPrctrModalOpen(true)}
              >
                <Token className="mr-2 h-4 w-4" />
                {prctrBalance.toLocaleString()} PRCTR
              </Button>
            </div>

            <ThemeToggle />

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-foreground hover:bg-accent/80 transition-all duration-200 hover:scale-105"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[400px] bg-background/95 backdrop-blur-md border-border"
              >
                <nav className="flex flex-col space-y-4 mt-8">
                  {/* Leaderboard in mobile navigation */}
                  <Link
                    href="/leaderboard"
                    className="text-lg font-medium transition-all duration-500 ease-out hover:text-foreground py-2 text-foreground relative group overflow-hidden rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="relative z-10">Leaderboard</span>
                    <span className="absolute inset-0 bg-accent/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out rounded-lg"></span>
                    <span className="absolute left-2 bottom-1 w-0 h-0.5 bg-foreground/60 transition-all duration-400 ease-out group-hover:w-4/5 group-hover:left-[10%] rounded-full"></span>
                  </Link>
                  <div className="space-y-2">
                    <Link href="/forecasts">
                      <Button
                        className="text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg hover:shadow-primary/25 w-full"
                        onClick={() => setIsOpen(false)}
                      >
                        <Wallet className="mr-2 h-4 w-4" />
                        USD: ${userBalance.toLocaleString()}
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="text-sm font-medium border-primary/30 text-primary hover:bg-primary/10 transition-all duration-300 ease-out w-full bg-transparent"
                      onClick={() => {
                        setIsPrctrModalOpen(true)
                        setIsOpen(false)
                      }}
                    >
                      <Token className="mr-2 h-4 w-4" />
                      PRCTR: {prctrBalance.toLocaleString()}
                    </Button>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Theme</span>
                      <ThemeToggle />
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>

            {/* User Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-8 w-8 rounded-full text-foreground hover:bg-accent/80 transition-all duration-200 hover:scale-110"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/diverse-user-avatars.png" alt="User" />
                    <AvatarFallback className="bg-accent text-foreground">U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-popover/95 backdrop-blur-md border-border" align="end" forceMount>
                <DropdownMenuItem className="text-popover-foreground hover:bg-accent/80 transition-all duration-200">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-popover-foreground hover:bg-accent/80 transition-all duration-200 cursor-pointer"
                  onClick={() => setIsUnderDevModalOpen(true)}
                >
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* PRCTR Token Modal */}
      <PrctrTokenModal
        isOpen={isPrctrModalOpen}
        onClose={() => setIsPrctrModalOpen(false)}
        currentBalance={prctrBalance}
      />

      {/* Under Development Modal for Settings */}
      <UnderDevelopmentModal
        isOpen={isUnderDevModalOpen}
        onClose={() => setIsUnderDevModalOpen(false)}
        pageName="Settings"
      />
    </>
  )
}
