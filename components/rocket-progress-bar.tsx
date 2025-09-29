"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ForecastModal } from "./forecast-modal"

interface RocketProgressBarProps {
  yesPercentage: number
  noPercentage: number
  onYesSwipe: () => void
  onNoSwipe: () => void
  className?: string
  startup?: any // Add startup prop for the modal
}

const ConfettiParticle = ({ delay }: { delay: number }) => (
  <div
    className="absolute w-2 h-2 rounded-full animate-bounce"
    style={{
      backgroundColor: ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"][Math.floor(Math.random() * 5)],
      left: `${Math.random() * 100}%`,
      animationDelay: `${delay}ms`,
      animationDuration: "1s",
    }}
  />
)

const ExplosionParticle = ({ delay }: { delay: number }) => (
  <div
    className="absolute w-3 h-3 rounded-full animate-ping"
    style={{
      backgroundColor: ["#EF4444", "#F97316", "#FBBF24"][Math.floor(Math.random() * 3)],
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${delay}ms`,
      animationDuration: "0.8s",
    }}
  />
)

export function RocketProgressBar({
  yesPercentage,
  noPercentage,
  onYesSwipe,
  onNoSwipe,
  className,
  startup,
}: RocketProgressBarProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragX, setDragX] = useState(0)
  const [animation, setAnimation] = useState<"none" | "yes" | "no">("none")
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [forecastType, setForecastType] = useState<"increase" | "decrease" | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const startX = useRef(0)
  const currentX = useRef(0)

  const handleStart = (clientX: number) => {
    setIsDragging(true)
    startX.current = clientX
    currentX.current = clientX
    setDragX(0)
    setAnimation("none")
  }

  const handleMove = (clientX: number) => {
    if (!isDragging) return

    const deltaX = clientX - startX.current
    const maxDrag = 120
    const clampedDelta = Math.max(-maxDrag, Math.min(maxDrag, deltaX))

    setDragX(clampedDelta)
    currentX.current = clientX
  }

  const handleEnd = () => {
    if (!isDragging) return

    const threshold = 60

    if (dragX < -threshold) {
      setAnimation("yes")
      setTimeout(() => {
        setForecastType("increase")
        setShowDepositModal(true)
        onYesSwipe()
        resetRocket()
      }, 1000)
    } else if (dragX > threshold) {
      setAnimation("no")
      setTimeout(() => {
        setForecastType("decrease")
        setShowDepositModal(true)
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
      return "translateX(-150px) scale(0.6) rotate(-15deg)"
    }
    if (animation === "no") {
      return "translateX(150px) scale(0.6) rotate(15deg)"
    }
    return `translateX(${dragX}px) scale(0.8) ${dragX < 0 ? "rotate(-5deg)" : dragX > 0 ? "rotate(5deg)" : ""}`
  }

  const getRocketOpacity = () => {
    if (animation === "yes" || animation === "no") {
      return "0.3"
    }
    return "1"
  }

  const getProgressFill = () => {
    const progress = (dragX + 120) / 240
    return Math.max(0, Math.min(1, progress))
  }

  const isNearYes = dragX < -30
  const isNearNo = dragX > 30

  return (
    <>
      <div
        className={cn("relative w-full h-32 flex flex-col items-center justify-center", className)}
        ref={containerRef}
      >
        <div className="relative w-64 h-2 bg-gray-200 rounded-full mb-8">
          {/* Progress fill */}
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-red-400 rounded-full transition-all duration-200"
            style={{ width: `${getProgressFill() * 100}%` }}
          />

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
            marginLeft: "-12px", // Adjusted for smaller rocket
            marginTop: "-20px", // Adjusted for smaller rocket
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative">
            <div className="w-6 h-10 bg-gradient-to-b from-blue-400 to-blue-600 rounded-t-full relative shadow-lg">
              {/* Rocket tip */}
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-400 rounded-full"></div>
              {/* Rocket window */}
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-cyan-300 rounded-full border border-cyan-500"></div>
              {/* Rocket fins */}
              <div className="absolute bottom-0 -left-0.5 w-1 h-2 bg-gray-500 transform rotate-12"></div>
              <div className="absolute bottom-0 -right-0.5 w-1 h-2 bg-gray-500 transform -rotate-12"></div>
            </div>

            {/* Rocket flames (when dragging or animating) */}
            {(isDragging || animation !== "none") && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                <div className="w-3 h-4 bg-gradient-to-b from-orange-400 via-red-500 to-yellow-400 rounded-b-full animate-pulse"></div>
                <div className="absolute top-0.5 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-gradient-to-b from-yellow-300 to-orange-400 rounded-b-full"></div>
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

        {isNearYes && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 8 }).map((_, i) => (
              <ConfettiParticle key={i} delay={i * 100} />
            ))}
          </div>
        )}

        {isNearNo && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 6 }).map((_, i) => (
              <ExplosionParticle key={i} delay={i * 150} />
            ))}
          </div>
        )}
      </div>

      {startup && (
        <ForecastModal
          isOpen={showDepositModal}
          onClose={() => setShowDepositModal(false)}
          startup={startup}
          forecastType={forecastType}
        />
      )}
    </>
  )
}
