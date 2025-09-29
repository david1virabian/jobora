"use client"

import { useState } from "react"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface PredictionDynamicsChartProps {
  companyName: string
}

export function PredictionDynamicsChart({ companyName }: PredictionDynamicsChartProps) {
  const generatePredictionData = () => {
    const data = []
    const baseValue = 67.5 // Starting prediction confidence to match the image
    let currentValue = baseValue

    for (let i = 0; i <= 30; i++) {
      // More sophisticated volatility patterns
      const volatility = (Math.random() - 0.5) * 6
      const trend = Math.sin(i * 0.15) * 4 + Math.cos(i * 0.08) * 2
      const momentum = i > 15 ? Math.sin((i - 15) * 0.3) * 3 : 0

      currentValue = Math.max(25, Math.min(90, currentValue + volatility + trend + momentum))

      data.push({
        day: i,
        confidence: Math.round(currentValue * 10) / 10,
        volume: Math.round((Math.random() * 50000 + 15000) / 1000) * 1000,
      })
    }
    return data
  }

  const [predictionData] = useState(generatePredictionData())

  return (
    <Card className="w-full max-w-2xl bg-gradient-to-br from-background to-muted/20 border-0 shadow-lg h-[520px] md:h-[520px] h-[600px] flex flex-col">
      <CardHeader className="pb-2 px-3 md:px-6 pt-3 md:pt-6 flex-shrink-0">
        <CardTitle className="text-xl md:text-xl text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent leading-tight">
          Prediction Dynamics - {companyName}
        </CardTitle>
        <p className="text-sm md:text-sm text-base text-muted-foreground font-medium mt-1">
          Market confidence trends over the last 30 days
        </p>
      </CardHeader>
      <CardContent className="px-3 md:px-6 pb-3 md:pb-6 flex-1 flex flex-col min-h-0">
        <ChartContainer
          config={{
            confidence: {
              label: "Market Confidence",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[320px] md:h-[280px] flex-shrink-0"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={predictionData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(var(--chart-1))" />
                  <stop offset="50%" stopColor="hsl(var(--chart-2))" />
                  <stop offset="100%" stopColor="hsl(var(--chart-3))" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" className="stroke-muted/40" horizontal={true} vertical={false} />
              <XAxis
                dataKey="day"
                className="text-xs font-medium"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
                tickLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis
                domain={[20, 95]}
                className="text-xs font-medium"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
                tickLine={{ stroke: "hsl(var(--border))" }}
                label={{
                  value: "Confidence %",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle", fontSize: "11px", fill: "hsl(var(--muted-foreground))" },
                }}
              />
              <ChartTooltip
                content={<ChartTooltipContent className="bg-background/95 backdrop-blur-sm border shadow-lg" />}
                formatter={(value: any, name: string) => [
                  `${value}%`,
                  name === "confidence" ? "Market Confidence" : name,
                ]}
                labelFormatter={(label) => `Day ${label}`}
              />
              <Area
                type="monotone"
                dataKey="confidence"
                stroke="url(#lineGradient)"
                strokeWidth={3}
                fill="url(#confidenceGradient)"
                dot={false}
                activeDot={{
                  r: 6,
                  stroke: "hsl(var(--chart-1))",
                  strokeWidth: 3,
                  fill: "hsl(var(--background))",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center md:gap-0 mt-4 md:mt-4 p-4 md:p-4 bg-muted/30 rounded-lg border flex-shrink-0">
          <div className="flex flex-col">
            <span className="text-sm md:text-xs text-muted-foreground font-medium">Current Confidence</span>
            <span className="text-2xl md:text-lg font-bold text-foreground mt-1">
              {predictionData[predictionData.length - 1]?.confidence}%
            </span>
          </div>
          <div className="flex flex-col text-left md:text-right">
            <span className="text-sm md:text-xs text-muted-foreground font-medium">Avg Volume</span>
            <span className="text-2xl md:text-lg font-bold text-foreground mt-1">
              ${Math.round(predictionData.reduce((sum, d) => sum + d.volume, 0) / predictionData.length / 1000)}K
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
