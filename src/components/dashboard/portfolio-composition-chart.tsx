"use client"

import * as React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import type { Stock } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface PortfolioCompositionChartProps extends React.HTMLAttributes<HTMLDivElement> {
  stocks: Stock[]
}

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export default function PortfolioCompositionChart({ stocks, className }: PortfolioCompositionChartProps) {
  const data = React.useMemo(() => {
    const sectorMap = new Map<string, number>()
    stocks.forEach(stock => {
      const sector = stock.sector || "Other"
      const value = stock.shares * stock.currentPrice
      sectorMap.set(sector, (sectorMap.get(sector) || 0) + value)
    })

    return Array.from(sectorMap.entries()).map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

  }, [stocks])

  return (
    <Card className={cn("animate-fade-in-up [animation-delay:450ms]", className)}>
      <CardHeader>
        <CardTitle>Sector Distribution</CardTitle>
        <CardDescription>Your portfolio's allocation by sector.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Tooltip
              contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
              }}
              formatter={(value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              innerRadius={50}
              paddingAngle={2}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
         <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-xs">
            {data.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span>{entry.name}</span>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}
