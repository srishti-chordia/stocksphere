import { RiskProfileForm } from "@/components/risk-profile/risk-profile-form";
import { Logo } from "@/components/logo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function RiskProfilePage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-muted/40">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Logo />
                            <div>
                                <CardTitle className="text-2xl">Investor Profile Quiz</CardTitle>
                                <CardDescription>
                                    Answer a few questions to understand your investment style.
                                </CardDescription>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/dashboard">
                                <ArrowLeft />
                                <span className="sr-only">Back to Dashboard</span>
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <RiskProfileForm />
                </CardContent>
            </Card>
        </div>
    );
}
