"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { PortfolioHistory } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PortfolioHistoryChartProps extends React.HTMLAttributes<HTMLDivElement> {
    totalValue: number;
}

export default function PortfolioHistoryChart({ totalValue, className }: PortfolioHistoryChartProps) {
    const [history, setHistory] = useState<PortfolioHistory[]>([]);

    useEffect(() => {
        // Create a stable initial history based on the initial total value
        const initialHistory = [
          { date: "30d ago", value: totalValue * 0.95 },
          { date: "15d ago", value: totalValue * 0.98 },
          { date: "7d ago", value: totalValue * 1.02 },
          { date: "Yesterday", value: totalValue * 0.99 },
        ];
        setHistory(initialHistory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setHistory(prev => {
            const newHistory = [...prev, { date: 'Today', value: parseFloat(totalValue.toFixed(2)) }];
            // Limit the history to the last 10 data points for performance and clarity
            if(newHistory.length > 10) {
                return newHistory.slice(newHistory.length - 10);
            }
            return newHistory;
        });
    }, [totalValue]);

    return (
        <Card className={cn("animate-fade-in-up [animation-delay:300ms]", className)}>
            <CardHeader>
                <CardTitle>Portfolio History</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                <LineChart data={history} margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.5} />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                      formatter={(value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)}
                    />
                    <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: "hsl(var(--primary))" }} activeDot={{ r: 6 }} />
                </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
