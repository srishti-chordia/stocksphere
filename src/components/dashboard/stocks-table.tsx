"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowUpDown, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import type { Stock } from "@/lib/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface StocksTableProps {
  stocks: Stock[];
  deleteStock: (stockId: string) => void;
}

type SortKey = keyof Stock | 'totalValue' | 'gainLoss';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

export default function StocksTable({ stocks, deleteStock }: StocksTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>({ key: 'totalValue', direction: 'descending' });

  const sortedStocks = useMemo(() => {
    let sortableStocks = [...stocks];
    if (sortConfig !== null) {
      sortableStocks.sort((a, b) => {
        const aValue = sortConfig.key === 'totalValue' ? a.shares * a.currentPrice : sortConfig.key === 'gainLoss' ? (a.currentPrice - a.purchasePrice) * a.shares : a[sortConfig.key];
        const bValue = sortConfig.key === 'totalValue' ? b.shares * b.currentPrice : sortConfig.key === 'gainLoss' ? (b.currentPrice - b.purchasePrice) * b.shares : b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableStocks;
  }, [stocks, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    return sortConfig.direction === 'ascending' ? '▲' : '▼';
  };

  return (
    <Card className="animate-fade-in-up [animation-delay:450ms]">
      <CardHeader>
        <CardTitle>Your Holdings</CardTitle>
        <CardDescription>A list of all stocks in your portfolio.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => requestSort('symbol')} className="cursor-pointer">Symbol {getSortIcon('symbol')}</TableHead>
              <TableHead onClick={() => requestSort('shares')} className="cursor-pointer text-right">Shares {getSortIcon('shares')}</TableHead>
              <TableHead onClick={() => requestSort('purchasePrice')} className="cursor-pointer text-right hidden md:table-cell">Avg. Cost {getSortIcon('purchasePrice')}</TableHead>
              <TableHead onClick={() => requestSort('currentPrice')} className="cursor-pointer text-right">Price {getSortIcon('currentPrice')}</TableHead>
              <TableHead onClick={() => requestSort('totalValue')} className="cursor-pointer text-right">Total Value {getSortIcon('totalValue')}</TableHead>
              <TableHead onClick={() => requestSort('gainLoss')} className="cursor-pointer text-right hidden sm:table-cell">Gain/Loss {getSortIcon('gainLoss')}</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedStocks.map((stock) => {
              const totalValue = stock.shares * stock.currentPrice;
              const gainLoss = (stock.currentPrice - stock.purchasePrice) * stock.shares;
              const isGain = gainLoss >= 0;

              return (
                <TableRow key={stock.id}>
                  <TableCell className="font-medium">
                    <Badge variant="secondary">{stock.symbol}</Badge>
                    <div className="text-xs text-muted-foreground md:hidden">{formatCurrency(stock.purchasePrice)}/share</div>
                  </TableCell>
                  <TableCell className="text-right">{stock.shares}</TableCell>
                  <TableCell className="text-right hidden md:table-cell">{formatCurrency(stock.purchasePrice)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(stock.currentPrice)}</TableCell>
                  <TableCell className="text-right font-semibold">{formatCurrency(totalValue)}</TableCell>
                  <TableCell className={cn("text-right hidden sm:table-cell", isGain ? "text-green-600" : "text-red-600")}>
                      <div className="flex items-center justify-end gap-1">
                        {isGain ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        {formatCurrency(gainLoss)}
                      </div>
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            holding of {stock.symbol}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteStock(stock.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {stocks.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
                <p>You have no stocks in your portfolio.</p>
                <p>Click &quot;Add Stock&quot; to get started.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
