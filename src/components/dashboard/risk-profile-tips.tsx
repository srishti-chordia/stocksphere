
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Shield, TrendingUp, Zap, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface RiskProfileTipsProps extends React.HTMLAttributes<HTMLDivElement> {
  profile: string | null;
  loading: boolean;
  error: string | null;
}

const tips: { [key: string]: { title: string, description: string, icon: React.ElementType } } = {
    Conservative: {
        title: "Conservative Strategy",
        description: "Focus on capital preservation with low-risk investments like bonds and blue-chip stocks. Diversification is key.",
        icon: Shield
    },
    Moderate: {
        title: "Moderate Strategy",
        description: "A balanced approach. Mix growth stocks with stable, dividend-paying assets to balance risk and return.",
        icon: TrendingUp
    },
    Aggressive: {
        title: "Aggressive Strategy",
        description: "Aim for high growth with investments in tech stocks and emerging markets. Be prepared for higher volatility.",
        icon: Zap
    },
}

export default function RiskProfileTips({ profile, loading, error, className }: RiskProfileTipsProps) {
  const tip = profile ? tips[profile] : null;

  const renderContent = () => {
    if (error) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Data Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )
    }

    if (loading) {
        return (
            <div className="flex items-start gap-4">
                <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                </div>
            </div>
        );
    }
    
    if (tip) {
      return (
        <div className="flex items-start gap-4">
          <tip.icon className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold">{tip.title}</h3>
            <p className="text-sm text-muted-foreground">{tip.description}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center text-muted-foreground flex flex-col items-center justify-center h-full">
        <p className="mb-4">Find out your investment style!</p>
        <Button asChild>
            <Link href="/risk-profile">Take the Risk Profile Quiz</Link>
        </Button>
      </div>
    );
  }

  return (
    <Card className={cn("animate-fade-in-down [animation-delay:300ms]", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-accent" />
          Investment Insights
        </CardTitle>
        <CardDescription>Personalized tips based on your risk profile.</CardDescription>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
