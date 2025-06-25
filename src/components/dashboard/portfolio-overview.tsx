"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Scale } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { Stock, PortfolioHistory } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PortfolioOverviewProps {
  totalValue: number;
  totalGainLoss: number;
  stocks: Stock[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

export default function PortfolioOverview({ totalValue, totalGainLoss, stocks }: PortfolioOverviewProps) {
  const [history, setHistory] = useState<PortfolioHistory[]>([]);

  useEffect(() => {
    const initialHistory = [
      { date: "30d ago", value: totalValue * 0.95 },
      { date: "15d ago", value: totalValue * 0.98 },
      { date: "7d ago", value: totalValue * 1.02 },
      { date: "Yesterday", value: totalValue * 0.99 },
    ];
    setHistory(initialHistory);
  }, []);

  useEffect(() => {
    setHistory(prev => {
        const newHistory = [...prev, { date: 'Today', value: parseFloat(totalValue.toFixed(2)) }];
        if(newHistory.length > 10) {
            return newHistory.slice(newHistory.length - 10);
        }
        return newHistory;
    });
  }, [totalValue]);


  const gainLossPercent = totalValue > 0 ? (totalGainLoss / (totalValue - totalGainLoss)) * 100 : 0;
  const isGain = totalGainLoss >= 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
      <Card className="animate-fade-in-down">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
          <p className="text-xs text-muted-foreground">
            Your net worth across all holdings
          </p>
        </CardContent>
      </Card>
      
      <Card className="animate-fade-in-down [animation-delay:150ms]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
          {isGain ? <TrendingUp className="h-4 w-4 text-green-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />}
        </CardHeader>
        <CardContent>
          <div className={cn("text-2xl font-bold", isGain ? "text-green-500" : "text-red-500")}>
            {formatCurrency(totalGainLoss)}
          </div>
          <p className={cn("text-xs", isGain ? "text-green-400" : "text-red-400")}>
            {gainLossPercent.toFixed(2)}% all time
          </p>
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-2 animate-fade-in-up [animation-delay:300ms]">
        <CardHeader>
          <CardTitle>Portfolio History</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={history} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.5} />
              <XAxis 
                dataKey="date" 
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: "hsl(var(--primary))" }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
