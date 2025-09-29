"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface RocketProgressBarProps {
  yesPercentage: number
  noPercentage: number
  onYesSwipe: () => void
  onNoSwipe: () => void
  className?: string
}

const ConfettiParticle = ({ delay, color }: { delay: number; color: string }) => {
  const randomX = Math.random() * 100
  const randomDuration = 2 + Math.random() * 3
  const randomSize = 4 + Math.random() * 8

  return (
    <div
      className="absolute animate-bounce"
      style={{
        left: `${randomX}%`,
        top: "-10px",
        width: `${randomSize}px`,
        height: `${randomSize}px`,
        backgroundColor: color,
        borderRadius: Math.random() > 0.5 ? "50%" : "0%",
        animationDelay: `${delay}s`,
        animationDuration: `${randomDuration}s`,
        animationIterationCount: "infinite",
        transform: "rotate(45deg)",
      }}
    />
  )
}

export function RocketProgressBar({
  yesPercentage,
  noPercentage,
  onYesSwipe,
  onNoSwipe,
  className,
}: RocketProgressBarProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragX, setDragX] = useState(0)
  const [animation, setAnimation] = useState<"none" | "yes" | "no">("none")
  const [showConfetti, setShowConfetti] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const startX = useRef(0)
  const currentX = useRef(0)

  const handleStart = (clientX: number) => {
    setIsDragging(true)
    startX.current = clientX
    currentX.current = clientX
    setDragX(0)
    setAnimation("none")
    setShowConfetti(false)
  }

  const handleMove = (clientX: number) => {
    if (!isDragging) return

    const deltaX = clientX - startX.current
    const maxDrag = 180
    const clampedDelta = Math.max(-maxDrag, Math.min(maxDrag, deltaX))

    setDragX(clampedDelta)
    currentX.current = clientX
  }

  const handleEnd = () => {
    if (!isDragging) return

    const threshold = 90

    if (dragX < -threshold) {
      setAnimation("yes")
      setShowConfetti(true)
      setTimeout(() => {
        onYesSwipe()
        resetRocket()
      }, 1000)
    } else if (dragX > threshold) {
      setAnimation("no")
      setShowConfetti(true)
      setTimeout(() => {
        onNoSwipe()
        resetRocket()
      }, 1000)
    } else {
      resetRocket()
    }
  }

  const resetRocket = () => {
    setIsDragging(false)
    setDragX(0)
    setAnimation("none")
    setTimeout(() => setShowConfetti(false), 2000)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientX)
  }

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX)
  }

  const handleMouseUp = () => {
    handleEnd()
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    handleStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    handleMove(e.touches[0].clientX)
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
    if (animation === "yes") {
      return "translateX(-225px) scale(0.8) rotate(-15deg)"
    }
    if (animation === "no") {
      return "translateX(225px) scale(0.8) rotate(15deg)"
    }
    return `translateX(${dragX}px) ${dragX < 0 ? "rotate(-5deg)" : dragX > 0 ? "rotate(5deg)" : ""}`
  }

  const getRocketOpacity = () => {
    if (animation === "yes" || animation === "no") {
      return "0.3"
    }
    return "1"
  }

  return (
    <div className={cn("relative w-full h-32 flex flex-col items-center justify-center", className)} ref={containerRef}>
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <ConfettiParticle
              key={i}
              delay={i * 0.1}
              color={
                animation === "yes"
                  ? ["#10B981", "#34D399", "#6EE7B7", "#A7F3D0"][i % 4]
                  : ["#EF4444", "#F87171", "#FCA5A5", "#FECACA"][i % 4]
              }
            />
          ))}
          {/* Additional confetti particles for more density */}
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={`extra-${i}`}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: "6px",
                height: "6px",
                backgroundColor: animation === "yes" ? "#10B981" : "#EF4444",
                borderRadius: "50%",
                animationDelay: `${i * 0.05}s`,
                animationDuration: "1s",
              }}
            />
          ))}
        </div>
      )}

      <div className="relative w-96 h-2 bg-gray-200 rounded-full mb-8">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-green-400 via-yellow-400 via-orange-400 to-red-400 rounded-full" />

        {/* YES label */}
        <div className="absolute -top-8 left-0 text-center">
          <div className="w-12 h-12 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center">
            <span className="text-xs font-bold text-green-700">{yesPercentage}%</span>
          </div>
          <span className="text-xs text-muted-foreground mt-1 block">Yes</span>
        </div>

        {/* NO label */}
        <div className="absolute -top-8 right-0 text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 border-2 border-red-500 flex items-center justify-center">
            <span className="text-xs font-bold text-red-700">{noPercentage}%</span>
          </div>
          <span className="text-xs text-muted-foreground mt-1 block">No</span>
        </div>
      </div>

      <div
        className={cn(
          "absolute cursor-grab active:cursor-grabbing select-none transition-all duration-300 ease-out",
          isDragging && "cursor-grabbing",
          animation === "yes" && "transition-all duration-1000 ease-out",
          animation === "no" && "transition-all duration-1000 ease-out",
        )}
        style={{
          transform: getRocketTransform(),
          opacity: getRocketOpacity(),
          top: "50%",
          left: "50%",
          marginLeft: "-16px",
          marginTop: "-32px",
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

          {/* Rocket flames (when dragging or animating) */}
          {(isDragging || animation !== "none") && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="w-4 h-6 bg-gradient-to-b from-orange-400 via-red-500 to-yellow-400 rounded-b-full animate-pulse"></div>
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-4 bg-gradient-to-b from-yellow-300 to-orange-400 rounded-b-full"></div>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-xs text-muted-foreground">Drag rocket left for YES, right for NO</p>
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
