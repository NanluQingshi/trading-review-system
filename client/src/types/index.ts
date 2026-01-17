// 交易方法类型
export interface Method {
  id: string;
  code: string;
  name: string;
  description: string;
  is_default: boolean;
  usage_count: number;
  win_rate: number;
  total_pnl: number;
}
// 交易记录类型
export interface Trade {
  id: number;
  symbol: string;
  direction: 'long' | 'short';
  entryPrice: number;
  exitPrice: number;
  entryTime: string;
  exitTime: string;
  lots: number;
  profit: number;
  expectedProfit?: number;
  methodId: string;
  methodName: string;
  notes: string;
  tags: string[];
  result: 'win' | 'loss' | 'breakeven';
}

// 统计数据类型
export interface Stats {
  overview: {
    totalTrades: number;
    winTrades: number;
    lossTrades: number;
    breakevenTrades: number;
    winRate: number;
    totalProfit: number;
    avgProfit: number;
    avgWin: number;
    avgLoss: number;
    profitFactor: number;
  };
  symbolStats: SymbolStat[];
  methodStats: MethodStat[];
  profitCurve: ProfitPoint[];
}

export interface SymbolStat {
  symbol: string;
  count: number;
  wins: number;
  profit: number;
  winRate: string;
}

export interface MethodStat {
  methodId: string;
  methodName: string;
  count: number;
  wins: number;
  profit: number;
  winRate: string;
}

export interface ProfitPoint {
  date: string;
  profit: number;
  cumulative: number;
}
