export type Stock = {
  id: string;
  symbol: string;
  shares: number;
  purchasePrice: number;
  purchaseDate: Date;
  currentPrice: number;
  sector?: string;
};

export type PortfolioHistory = {
  date: string;
  value: number;
};
