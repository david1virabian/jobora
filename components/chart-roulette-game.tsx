"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Play, Square } from "lucide-react"

const SEGMENTS = [
  { multiplier: "x2", color: "#6366f1", gradient: "from-indigo-500 to-indigo-600", angle: 0 },
  { multiplier: "x5", color: "#8b5cf6", gradient: "from-violet-500 to-violet-600", angle: 60 },
  { multiplier: "x10", color: "#06b6d4", gradient: "from-cyan-500 to-cyan-600", angle: 120 },
  { multiplier: "x20", color: "#10b981", gradient: "from-emerald-500 to-emerald-600", angle: 180 },
  { multiplier: "x100", color: "#f59e0b", gradient: "from-amber-500 to-amber-600", angle: 240 },
  { multiplier: "x500", color: "#ec4899", gradient: "from-pink-500 to-pink-600", angle: 300 },
]

const createConfetti = () => {
  const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7", "#dda0dd", "#98d8c8"]

  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement("div")
    confetti.style.position = "fixed"
    confetti.style.left = Math.random() * 100 + "vw"
    confetti.style.top = "-10px"
    confetti.style.width = "10px"
    confetti.style.height = "10px"
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
    confetti.style.pointerEvents = "none"
    confetti.style.zIndex = "9999"
    confetti.style.borderRadius = "50%"
    confetti.style.animation = `confetti-fall ${2 + Math.random() * 3}s linear forwards`

    // Add rotation animation
    const rotation = Math.random() * 360
    confetti.style.transform = `rotate(${rotation}deg)`

    document.body.appendChild(confetti)

    // Remove confetti after animation
    setTimeout(() => {
      if (confetti.parentNode) {
        confetti.parentNode.removeChild(confetti)
      }
    }, 5000)
  }
}

if (typeof document !== "undefined") {
  const style = document.createElement("style")
  style.textContent = `
    @keyframes confetti-fall {
      0% {
        transform: translateY(-10px) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
      }
    }
  `
  document.head.appendChild(style)
}

export function ChartRouletteGame() {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [playerGuess, setPlayerGuess] = useState<string | null>(null)
  const animationRef = useRef<number>()

  const startSpin = () => {
    if (isSpinning || !playerGuess) return

    setIsSpinning(true)
    setResult(null)

    // Generate random final rotation (multiple full spins + random position)
    const spins = 5 + Math.random() * 10 // 5-15 full rotations
    const finalAngle = Math.random() * 360
    const totalRotation = rotation + spins * 360 + finalAngle

    const duration = 3000 + Math.random() * 2000 // 3-5 seconds
    const startTime = Date.now()
    const startRotation = rotation

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for realistic deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentRotation = startRotation + (totalRotation - startRotation) * easeOut

      setRotation(currentRotation)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setIsSpinning(false)
        checkResult(totalRotation % 360)
      }
    }

    animationRef.current = requestAnimationFrame(animate)
  }

  const checkResult = (finalAngle: number) => {
    // Normalize angle to 0-360 and adjust for pointer position (top of wheel)
    const normalizedAngle = (360 - (finalAngle % 360) + 90) % 360

    // Find which segment the pointer landed on
    const segmentAngle = 360 / SEGMENTS.length
    const segmentIndex = Math.floor(normalizedAngle / segmentAngle)
    const landedSegment = SEGMENTS[segmentIndex]

    setResult(landedSegment.multiplier)

    // Check if player guessed correctly
    if (playerGuess === landedSegment.multiplier) {
      const multiplierValue = Number.parseInt(landedSegment.multiplier.replace("x", ""))
      const points = 10 * multiplierValue
      setScore((prev) => prev + points)

      setTimeout(() => {
        createConfetti()
      }, 500)
    }
  }

  const makeGuess = (multiplier: string) => {
    if (isSpinning) return
    setPlayerGuess(multiplier)
    setResult(null)
  }

  const resetGame = () => {
    setRotation(0)
    setResult(null)
    setPlayerGuess(null)
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    setIsSpinning(false)
  }

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-xl backdrop-blur-sm h-[520px] flex flex-col">
      <div className="flex flex-col gap-2 p-4 sm:p-5 pb-2 sm:pb-3 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent text-balance">
              AI Growth Roulette
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 text-pretty font-medium">
              Guess how much our AI engine thinks the project would grow in total?
            </p>
          </div>
          <div className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white px-3 py-1.5 rounded-xl shadow-lg flex-shrink-0">
            <div className="text-xs font-medium opacity-90">Score</div>
            <div className="text-lg sm:text-xl font-bold">{score}</div>
          </div>
        </div>

        <div className="flex justify-center sm:justify-end min-h-[32px]">
          {result && playerGuess === result && (
            <div className="bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-semibold text-base px-4 py-2 rounded-xl">
              ✨ Correct! +{10 * Number.parseInt(result.replace("x", ""))} points
            </div>
          )}
          {result && playerGuess !== result && (
            <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 text-red-700 dark:text-red-400 font-semibold text-base px-4 py-2 rounded-xl">
              ❌ Wrong! Landed on {result}
            </div>
          )}
          {playerGuess && !result && (
            <div className="bg-indigo-500/10 backdrop-blur-sm border border-indigo-500/20 text-indigo-700 dark:text-indigo-400 font-medium text-base px-4 py-2 rounded-xl">
              Your Guess: {playerGuess}
            </div>
          )}
        </div>
      </div>

      <div className="px-4 sm:px-5 pb-4 sm:pb-5 flex-1 flex flex-col min-h-0">
        <div className="space-y-3 sm:space-y-4 flex-1 flex flex-col">
          <div className="flex justify-center flex-1 items-center">
            <div className="relative">
              <div className="relative w-56 h-56 sm:w-64 sm:h-64">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-cyan-500/20 blur-xl"></div>

                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 400 400"
                  className="relative z-10 drop-shadow-2xl"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transition: isSpinning ? "none" : "transform 0.5s ease-out",
                  }}
                >
                  {SEGMENTS.map((segment, index) => {
                    const startAngle = index * 60 - 90
                    const endAngle = startAngle + 60
                    const startAngleRad = (startAngle * Math.PI) / 180
                    const endAngleRad = (endAngle * Math.PI) / 180

                    const x1 = 200 + 180 * Math.cos(startAngleRad)
                    const y1 = 200 + 180 * Math.sin(startAngleRad)
                    const x2 = 200 + 180 * Math.cos(endAngleRad)
                    const y2 = 200 + 180 * Math.sin(endAngleRad)

                    const textAngle = startAngle + 30
                    const textAngleRad = (textAngle * Math.PI) / 180
                    const textX = 200 + 130 * Math.cos(textAngleRad)
                    const textY = 200 + 130 * Math.sin(textAngleRad)

                    return (
                      <g key={index}>
                        <defs>
                          <radialGradient id={`gradient-${index}`} cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor={segment.color} stopOpacity="0.9" />
                            <stop offset="100%" stopColor={segment.color} stopOpacity="1" />
                          </radialGradient>
                        </defs>
                        <path
                          d={`M 200 200 L ${x1} ${y1} A 180 180 0 0 1 ${x2} ${y2} Z`}
                          fill={`url(#gradient-${index})`}
                          stroke="rgba(255,255,255,0.3)"
                          strokeWidth="2"
                          className="hover:brightness-110 transition-all duration-300"
                        />
                        <text
                          x={textX}
                          y={textY}
                          fill="white"
                          fontSize="22"
                          fontWeight="700"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                          className="pointer-events-none select-none drop-shadow-lg"
                          style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
                        >
                          {segment.multiplier}
                        </text>
                      </g>
                    )
                  })}

                  <defs>
                    <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#1e293b" />
                      <stop offset="100%" stopColor="#0f172a" />
                    </radialGradient>
                  </defs>
                  <circle
                    cx="200"
                    cy="200"
                    r="30"
                    fill="url(#centerGradient)"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="3"
                    className="drop-shadow-lg"
                  />
                  <circle cx="200" cy="200" r="15" fill="rgba(255,255,255,0.1)" />
                </svg>

                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                  <div className="relative">
                    <div className="w-0 h-0 border-l-[18px] border-r-[18px] border-b-[36px] border-l-transparent border-r-transparent border-b-slate-800 drop-shadow-xl"></div>
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[15px] border-r-[15px] border-b-[30px] border-l-transparent border-r-transparent border-b-gradient-to-b from-slate-600 to-slate-800"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2 flex-shrink-0">
            {SEGMENTS.map((segment) => (
              <Button
                key={segment.multiplier}
                onClick={() => makeGuess(segment.multiplier)}
                disabled={isSpinning}
                className={`min-h-[36px] text-xs sm:text-sm font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg rounded-xl border-2 backdrop-blur-sm ${
                  playerGuess === segment.multiplier
                    ? `bg-gradient-to-r ${segment.gradient} text-white shadow-lg border-transparent`
                    : `bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:bg-white/70 dark:hover:bg-slate-800/70`
                }`}
                style={{
                  color: playerGuess === segment.multiplier ? "white" : segment.color,
                  borderColor: playerGuess === segment.multiplier ? "transparent" : segment.color + "40",
                }}
              >
                {segment.multiplier}
              </Button>
            ))}
          </div>

          <div className="flex justify-center flex-shrink-0">
            <Button
              onClick={startSpin}
              disabled={isSpinning || !playerGuess}
              className="flex items-center gap-2 min-h-[40px] px-6 text-sm font-bold rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              size="lg"
            >
              {isSpinning ? (
                <>
                  <Square className="h-6 w-6 animate-spin" />
                  Spinning...
                </>
              ) : (
                <>
                  <Play className="h-6 w-6" />
                  Spin Wheel
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
