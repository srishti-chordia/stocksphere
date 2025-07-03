
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { PlusCircle, LogOut, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import PortfolioOverview from "@/components/dashboard/portfolio-overview";
import StocksTable from "@/components/dashboard/stocks-table";
import { AddStockDialog } from "@/components/dashboard/add-stock-dialog";
import type { Stock } from "@/lib/types";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import PortfolioCompositionChart from "@/components/dashboard/portfolio-composition-chart";
import RiskProfileTips from "@/components/dashboard/risk-profile-tips";
import PortfolioHistoryChart from "@/components/dashboard/portfolio-history-chart";
import { useToast } from "@/hooks/use-toast";

const initialStocks: Stock[] = [
  { id: '1', symbol: 'AAPL', shares: 10, purchasePrice: 150.00, purchaseDate: new Date('2023-01-15'), currentPrice: 175.28, sector: 'Technology' },
  { id: '2', symbol: 'GOOGL', shares: 5, purchasePrice: 2800.00, purchaseDate: new Date('2023-02-20'), currentPrice: 2850.75, sector: 'Technology' },
  { id: '3', symbol: 'MSFT', shares: 8, purchasePrice: 300.50, purchaseDate: new Date('2023-03-10'), currentPrice: 330.90, sector: 'Technology' },
  { id: '4', symbol: 'JNJ', shares: 15, purchasePrice: 160.00, purchaseDate: new Date('2023-04-05'), currentPrice: 165.45, sector: 'Healthcare' },
  { id: '5', symbol: 'V', shares: 12, purchasePrice: 220.00, purchaseDate: new Date('2023-05-12'), currentPrice: 245.60, sector: 'Financials' },
];

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [stocks, setStocks] = useState<Stock[]>(initialStocks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [riskProfile, setRiskProfile] = useState<string | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);


  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/");
    }
  }, [user, authLoading, router]);
  
  useEffect(() => {
    if (!user) {
      setIsProfileLoading(false);
      setRiskProfile(null);
      return;
    }

    const fetchRiskProfile = async () => {
      if (!db) return;
      setIsProfileLoading(true);
      setProfileError(null);
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRiskProfile(docSnap.data()?.riskProfile || null);
        } else {
          // This can happen if the user was created before we started creating user docs on signup.
          // It's not an error, they just need to take the quiz.
          setRiskProfile(null);
        }
      } catch (error: any) {
        console.error("Error fetching risk profile:", error);
        const description = "Failed to load profile data. This is often caused by incorrect Firestore security rules. Please ensure authenticated users can read from the 'users' collection.";
        setProfileError(description);
        toast({
          variant: "destructive",
          title: "Data Load Error",
          description: description,
        });
      } finally {
        setIsProfileLoading(false);
      }
    };

    fetchRiskProfile();
  }, [user, toast]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prevStocks =>
        prevStocks.map(stock => {
          const change = (Math.random() - 0.5) * 2; // Random change between -1 and 1
          const newPrice = Math.max(0, stock.currentPrice + change);
          return { ...stock, currentPrice: parseFloat(newPrice.toFixed(2)) };
        })
      );
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const addStock = useCallback((newStock: Omit<Stock, 'id' | 'currentPrice' | 'sector'>) => {
    setStocks(prev => [
      ...prev,
      {
        ...newStock,
        id: (prev.length + 1).toString(),
        currentPrice: newStock.purchasePrice, // Set initial current price to purchase price
        sector: 'Other' // Default sector for new stocks
      }
    ]);
  }, []);

  const deleteStock = useCallback((stockId: string) => {
    setStocks(prev => prev.filter(stock => stock.id !== stockId));
  }, []);

  const portfolioData = useMemo(() => {
    const totalValue = stocks.reduce((acc, stock) => acc + stock.shares * stock.currentPrice, 0);
    const totalCost = stocks.reduce((acc, stock) => acc + stock.shares * stock.purchasePrice, 0);
    const totalGainLoss = totalValue - totalCost;
    return { totalValue, totalGainLoss };
  }, [stocks]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
       <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
         <div className="flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <h1 className="text-2xl font-bold tracking-tight">StockSphere</h1>
         </div>
         <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1" asChild>
                <Link href="/risk-profile">
                    <FileText className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Risk Profile
                    </span>
                </Link>
            </Button>
            <Button size="sm" className="h-8 gap-1" onClick={() => setIsDialogOpen(true)}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Stock
                </span>
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Logout</span>
            </Button>
         </div>
       </header>
       <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <PortfolioOverview totalValue={portfolioData.totalValue} totalGainLoss={portfolioData.totalGainLoss} />
            <RiskProfileTips profile={riskProfile} loading={isProfileLoading} error={profileError} className="lg:col-span-2" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8">
            <PortfolioHistoryChart totalValue={portfolioData.totalValue} />
            <PortfolioCompositionChart stocks={stocks} />
        </div>
        <StocksTable stocks={stocks} deleteStock={deleteStock} />
      </main>
      <AddStockDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        addStock={addStock}
      />
    </div>
  );
}
