"use client"
import { useState } from "react"
import { UnderDevelopmentModal } from "./under-development-modal"

export function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPage, setSelectedPage] = useState<string>("")

  const handleLinkClick = (pageName: string) => {
    setSelectedPage(pageName)
    setIsModalOpen(true)
  }

  return (
    <>
      <footer className="border-t bg-muted/50">
        <div className="container px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Platform</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <button
                    onClick={() => handleLinkClick("How it works")}
                    className="hover:text-foreground transition-colors text-left"
                  >
                    How it works
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick("Methodology")}
                    className="hover:text-foreground transition-colors text-left"
                  >
                    Methodology
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick("Market Rules")}
                    className="hover:text-foreground transition-colors text-left"
                  >
                    Market Rules
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick("Scoring System")}
                    className="hover:text-foreground transition-colors text-left"
                  >
                    Scoring System
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-foreground">Markets</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <button
                    onClick={() => handleLinkClick("Browse Markets")}
                    className="hover:text-foreground transition-colors text-left"
                  >
                    Browse Markets
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick("Create Market")}
                    className="hover:text-foreground transition-colors text-left"
                  >
                    Create Market
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick("Market Analytics")}
                    className="hover:text-foreground transition-colors text-left"
                  >
                    Market Analytics
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick("Leaderboard")}
                    className="hover:text-foreground transition-colors text-left"
                  >
                    Leaderboard
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-foreground">Resources</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <button
                    onClick={() => handleLinkClick("API Documentation")}
                    className="hover:text-foreground transition-colors text-left"
                  >
                    API Documentation
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick("Trading Guide")}
                    className="hover:text-foreground transition-colors text-left"
                  >
                    Trading Guide
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick("FAQ")}
                    className="hover:text-foreground transition-colors text-left"
                  >
                    FAQ
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick("Blog")}
                    className="hover:text-foreground transition-colors text-left"
                  >
                    Blog
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-foreground">Community</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <button
                    onClick={() => handleLinkClick("Discord")}
                    className="hover:text-foreground transition-colors text-left"
                  >
                    Discord
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick("Twitter")}
                    className="hover:text-foreground transition-colors text-left"
                  >
                    Twitter
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick("Telegram")}
                    className="hover:text-foreground transition-colors text-left"
                  >
                    Telegram
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick("Support")}
                    className="hover:text-foreground transition-colors text-left"
                  >
                    Support
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-foreground">Legal</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <button
                    onClick={() => handleLinkClick("Terms of Service")}
                    className="hover:text-foreground transition-colors text-left"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick("Privacy Policy")}
                    className="hover:text-foreground transition-colors text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick("Risk Disclosure")}
                    className="hover:text-foreground transition-colors text-left"
                  >
                    Risk Disclosure
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick("Compliance")}
                    className="hover:text-foreground transition-colors text-left"
                  >
                    Compliance
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-muted-foreground">
                <p>Predictr 2025 copyright, all rights reserved</p>
                <p className="mt-1">Demo platform powered by PRCTR tokens</p>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Sample data inspired by Crunchbase and market research</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <UnderDevelopmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} pageName={selectedPage} />
    </>
  )
}
