"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface PortfolioOverviewProps {
  totalValue: number;
  totalGainLoss: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

export default function PortfolioOverview({ totalValue, totalGainLoss }: PortfolioOverviewProps) {
  const gainLossPercent = totalValue > 0 ? (totalGainLoss / (totalValue - totalGainLoss)) * 100 : 0;
  const isGain = totalGainLoss >= 0;

  return (
    <>
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
    </>
  );
}
