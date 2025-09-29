"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface RocketSwipeProps {
  yesPercentage: number
  noPercentage: number
  onYesSwipe: () => void
  onNoSwipe: () => void
  className?: string
}

export function RocketSwipe({ yesPercentage, noPercentage, onYesSwipe, onNoSwipe, className }: RocketSwipeProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragY, setDragY] = useState(0)
  const [animation, setAnimation] = useState<"none" | "moon" | "crash">("none")
  const containerRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  const currentY = useRef(0)

  const handleStart = (clientY: number) => {
    setIsDragging(true)
    startY.current = clientY
    currentY.current = clientY
    setDragY(0)
    setAnimation("none")
  }

  const handleMove = (clientY: number) => {
    if (!isDragging) return

    const deltaY = clientY - startY.current
    const maxDrag = 100
    const clampedDelta = Math.max(-maxDrag, Math.min(maxDrag, deltaY))

    setDragY(clampedDelta)
    currentY.current = clientY
  }

  const handleEnd = () => {
    if (!isDragging) return

    const threshold = 50

    if (dragY < -threshold) {
      // Swiped up - YES (to the moon)
      setAnimation("moon")
      setTimeout(() => {
        onYesSwipe()
        resetRocket()
      }, 1500)
    } else if (dragY > threshold) {
      // Swiped down - NO (crash)
      setAnimation("crash")
      setTimeout(() => {
        onNoSwipe()
        resetRocket()
      }, 1500)
    } else {
      // Not enough swipe, return to center
      resetRocket()
    }
  }

  const resetRocket = () => {
    setIsDragging(false)
    setDragY(0)
    setAnimation("none")
  }

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientY)
  }

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientY)
  }

  const handleMouseUp = () => {
    handleEnd()
  }

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    handleStart(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    handleMove(e.touches[0].clientY)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault()
    handleEnd()
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging])

  const getRocketTransform = () => {
    if (animation === "moon") {
      return "translateY(-200px) scale(0.5)"
    }
    if (animation === "crash") {
      return "translateY(200px) rotate(180deg) scale(0.8)"
    }
    return `translateY(${dragY}px) ${dragY < 0 ? "rotate(-10deg)" : dragY > 0 ? "rotate(10deg)" : ""}`
  }

  const getRocketOpacity = () => {
    if (animation === "moon" || animation === "crash") {
      return "0"
    }
    return "1"
  }

  return (
    <div className={cn("relative w-full h-48 flex flex-col items-center justify-center", className)} ref={containerRef}>
      {/* Moon */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
        <div className="w-8 h-8 rounded-full bg-yellow-200 border-2 border-yellow-300 shadow-lg">
          <div className="w-2 h-2 bg-yellow-400 rounded-full absolute top-1 left-2"></div>
          <div className="w-1 h-1 bg-yellow-400 rounded-full absolute top-3 left-4"></div>
          <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full absolute top-4 left-1"></div>
        </div>
      </div>

      {/* Percentage displays */}
      <div className="absolute top-8 left-4 text-center">
        <div className="w-12 h-12 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center">
          <span className="text-xs font-bold text-green-700">{yesPercentage}%</span>
        </div>
        <span className="text-xs text-muted-foreground mt-1 block">Yes</span>
      </div>

      <div className="absolute top-8 right-4 text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 border-2 border-red-500 flex items-center justify-center">
          <span className="text-xs font-bold text-red-700">{noPercentage}%</span>
        </div>
        <span className="text-xs text-muted-foreground mt-1 block">No</span>
      </div>

      {/* Rocket */}
      <div
        className={cn(
          "cursor-grab active:cursor-grabbing select-none transition-all duration-300 ease-out",
          isDragging && "cursor-grabbing",
          animation === "moon" && "transition-all duration-1500 ease-out",
          animation === "crash" && "transition-all duration-1500 ease-in",
        )}
        style={{
          transform: getRocketTransform(),
          opacity: getRocketOpacity(),
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative">
          {/* Rocket body */}
          <div className="w-8 h-16 bg-gradient-to-b from-gray-300 to-gray-500 rounded-t-full relative">
            {/* Rocket tip */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full"></div>
            {/* Rocket windows */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-400 rounded-full border border-blue-600"></div>
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-300 rounded-full"></div>
            {/* Rocket fins */}
            <div className="absolute bottom-0 -left-1 w-2 h-4 bg-gray-600 transform rotate-12"></div>
            <div className="absolute bottom-0 -right-1 w-2 h-4 bg-gray-600 transform -rotate-12"></div>
          </div>

          {/* Rocket flames (only when dragging down or crashing) */}
          {(dragY > 0 || animation === "crash") && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="w-4 h-6 bg-gradient-to-b from-orange-400 via-red-500 to-yellow-400 rounded-b-full animate-pulse"></div>
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-4 bg-gradient-to-b from-yellow-300 to-orange-400 rounded-b-full"></div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-xs text-muted-foreground">Swipe rocket up for YES, down for NO</p>
      </div>

      {/* Stars background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 left-8 w-1 h-1 bg-yellow-300 rounded-full animate-pulse"></div>
        <div className="absolute top-12 right-12 w-1 h-1 bg-yellow-300 rounded-full animate-pulse delay-300"></div>
        <div className="absolute top-20 left-16 w-1 h-1 bg-yellow-300 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-16 right-8 w-1 h-1 bg-yellow-300 rounded-full animate-pulse delay-500"></div>
      </div>
    </div>
  )
}
