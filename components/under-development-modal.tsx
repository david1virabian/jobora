"use client"
import { Construction } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface UnderDevelopmentModalProps {
  isOpen: boolean
  onClose: () => void
  pageName?: string
}

export function UnderDevelopmentModal({ isOpen, onClose, pageName }: UnderDevelopmentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-orange-100 dark:bg-orange-900/20">
            <Construction className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <DialogTitle className="text-center">Page Under Development</DialogTitle>
          <DialogDescription className="text-center">
            {pageName ? `The ${pageName} page` : "This page"} is currently under development and will be available soon.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-6">
          <Button onClick={onClose} className="w-full sm:w-auto">
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
