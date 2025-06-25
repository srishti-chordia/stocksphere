"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Shield, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import Link from "next/link";

interface RiskProfileTipsProps extends React.HTMLAttributes<HTMLDivElement> {
  profile: string | null;
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

export default function RiskProfileTips({ profile, className }: RiskProfileTipsProps) {
  const tip = profile ? tips[profile] : null;

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
        {tip ? (
          <div className="flex items-start gap-4">
            <tip.icon className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold">{tip.title}</h3>
              <p className="text-sm text-muted-foreground">{tip.description}</p>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground flex flex-col items-center justify-center h-full">
            <p className="mb-4">Find out your investment style!</p>
            <Button asChild>
                <Link href="/risk-profile">Take the Risk Profile Quiz</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
