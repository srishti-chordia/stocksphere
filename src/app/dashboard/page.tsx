"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { PlusCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import PortfolioOverview from "@/components/dashboard/portfolio-overview";
import StocksTable from "@/components/dashboard/stocks-table";
import { AddStockDialog } from "@/components/dashboard/add-stock-dialog";
import type { Stock } from "@/lib/types";
import { Logo } from "@/components/logo";
import Link from "next/link";

const initialStocks: Stock[] = [
  { id: '1', symbol: 'AAPL', shares: 10, purchasePrice: 150.00, purchaseDate: new Date('2023-01-15'), currentPrice: 175.28 },
  { id: '2', symbol: 'GOOGL', shares: 5, purchasePrice: 2800.00, purchaseDate: new Date('2023-02-20'), currentPrice: 2850.75 },
  { id: '3', symbol: 'MSFT', shares: 8, purchasePrice: 300.50, purchaseDate: new Date('2023-03-10'), currentPrice: 330.90 },
];

export default function DashboardPage() {
  const [stocks, setStocks] = useState<Stock[]>(initialStocks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const addStock = useCallback((newStock: Omit<Stock, 'id' | 'currentPrice'>) => {
    setStocks(prev => [
      ...prev,
      {
        ...newStock,
        id: (prev.length + 1).toString(),
        currentPrice: newStock.purchasePrice // Set initial current price to purchase price
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
         <div className="ml-auto flex items-center gap-4">
             <Button size="sm" className="h-8 gap-1" onClick={() => setIsDialogOpen(true)}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Stock
                </span>
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                <Link href="/">
                    <LogOut className="h-4 w-4" />
                    <span className="sr-only">Logout</span>
                </Link>
            </Button>
         </div>
       </header>
       <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <PortfolioOverview totalValue={portfolioData.totalValue} totalGainLoss={portfolioData.totalGainLoss} stocks={stocks} />
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
