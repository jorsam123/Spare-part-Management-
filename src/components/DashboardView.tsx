import React from 'react';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  DollarSign,
  ShoppingCart,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Warehouse,
  Truck,
  Wrench,
  Receipt,
} from 'lucide-react';
import { Part, StockTransaction, SaleInvoice } from '../types/inventory';
import { formatCurrency, formatNumber, formatDateTime, getStockStatus } from '../utils/formatters';

interface DashboardViewProps {
  parts: Part[];
  transactions: StockTransaction[];
  invoices: SaleInvoice[];
  onSelectPart: (part: Part) => void;
  onOpenQuickAction: (mode: 'RECEIPT' | 'ISSUE' | 'ADJUSTMENT', preselectedPartId?: string) => void;
  onOpenNewSale: () => void;
  onNavigateTab: (tab: string) => void;
  onAutoGeneratePO: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  parts,
  transactions,
  invoices,
  onSelectPart,
  onOpenQuickAction,
  onOpenNewSale,
  onNavigateTab,
  onAutoGeneratePO,
}) => {
  // Calculations
  const totalSKUs = parts.length;
  const totalUnits = parts.reduce((acc, p) => acc + p.stockQuantity, 0);
  const totalInventoryCost = parts.reduce((acc, p) => acc + p.stockQuantity * p.unitCost, 0);
  const totalInventoryRetailValue = parts.reduce(
    (acc, p) => acc + p.stockQuantity * p.sellingPrice,
    0
  );

  const totalStoreSalesRevenue = invoices
    .filter((inv) => inv.status !== 'Cancelled')
    .reduce((acc, inv) => acc + inv.grandTotal, 0);

  const totalGrossProfit = invoices
    .filter((inv) => inv.status !== 'Cancelled')
    .reduce((acc, inv) => acc + inv.grossProfit, 0);

  const criticalParts = parts.filter((p) => p.stockQuantity < p.minStockLevel);
  const lowStockParts = parts.filter(
    (p) => p.stockQuantity <= p.reorderPoint && p.stockQuantity >= p.minStockLevel
  );

  // Machinery fleet distribution (Caterpillar, Komatsu, Volvo, Hitachi, etc.)
  const makeStats = React.useMemo(() => {
    const map = new Map<string, { count: number; value: number }>();
    parts.forEach((p) => {
      p.compatibleVehicles.forEach((v) => {
        const existing = map.get(v.make) || { count: 0, value: 0 };
        existing.count += 1;
        existing.value += p.stockQuantity * p.sellingPrice;
        map.set(v.make, existing);
      });
    });
    return Array.from(map.entries())
      .map(([make, data]) => ({ make, ...data }))
      .sort((a, b) => b.count - a.count);
  }, [parts]);

  // Category breakdown
  const categoryStats = React.useMemo(() => {
    const map = new Map<string, { count: number; value: number; units: number }>();
    parts.forEach((p) => {
      const existing = map.get(p.category) || { count: 0, value: 0, units: 0 };
      existing.count += 1;
      existing.units += p.stockQuantity;
      existing.value += p.stockQuantity * p.sellingPrice;
      map.set(p.category, existing);
    });
    return Array.from(map.entries())
      .map(([category, data]) => ({ category, ...data }))
      .sort((a, b) => b.value - a.value);
  }, [parts]);

  const recentTransactions = transactions.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Top Scorecard - 6 Metrics with Single Elevation & Tabular Figures */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Store Sales Revenue */}
        <div
          onClick={() => onNavigateTab('sales')}
          className="p-4 bg-slate-900/60 border border-slate-800 rounded hover:border-slate-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Store Revenue</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 tabular-nums tracking-tight font-mono">
            {formatCurrency(totalStoreSalesRevenue)}
          </p>
          <div className="mt-1 text-[11px] text-slate-400">
            {invoices.length} orders fulfilled
          </div>
        </div>

        {/* Realized Gross Profit */}
        <div
          onClick={() => onNavigateTab('sales')}
          className="p-4 bg-slate-900/60 border border-slate-800 rounded hover:border-slate-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Sales Profit</span>
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 tabular-nums tracking-tight font-mono">
            {formatCurrency(totalGrossProfit)}
          </p>
          <div className="mt-1 text-[11px] text-slate-400">
            Gross parts margin
          </div>
        </div>

        {/* Physical Stock Units */}
        <div
          onClick={() => onNavigateTab('inventory')}
          className="p-4 bg-slate-900/60 border border-slate-800 rounded hover:border-slate-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Stock Units</span>
            <Warehouse className="w-3.5 h-3.5" />
          </div>
          <p className="text-2xl font-bold text-white tabular-nums tracking-tight font-mono">
            {formatNumber(totalUnits)}
          </p>
          <div className="mt-1 text-[11px] text-slate-400">
            Across {totalSKUs} heavy SKUs
          </div>
        </div>

        {/* Stock Valuation (Retail Value) */}
        <div
          onClick={() => onNavigateTab('inventory')}
          className="p-4 bg-slate-900/60 border border-slate-800 rounded hover:border-slate-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Inventory Value</span>
            <Boxes className="w-3.5 h-3.5" />
          </div>
          <p className="text-2xl font-bold text-white tabular-nums tracking-tight font-mono">
            {formatCurrency(totalInventoryRetailValue)}
          </p>
          <div className="mt-1 text-[11px] text-slate-400 font-mono">
            Cost: {formatCurrency(totalInventoryCost)}
          </div>
        </div>

        {/* Critical Shortages */}
        <div
          onClick={() => onNavigateTab('inventory')}
          className={`p-4 border rounded cursor-pointer transition-colors ${
            criticalParts.length > 0
              ? 'bg-rose-950/20 border-rose-800/60 hover:bg-rose-950/30'
              : 'bg-slate-900/60 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <span className="text-xs font-medium">Critical Shortages</span>
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <p className="text-2xl font-bold text-rose-400 tabular-nums tracking-tight font-mono">
            {criticalParts.length}
          </p>
          <div className="mt-1 text-[11px] text-rose-400/80">
            Below safety minimum
          </div>
        </div>

        {/* Needs Reorder */}
        <div
          onClick={() => onNavigateTab('inventory')}
          className="p-4 bg-slate-900/60 border border-slate-800 rounded hover:border-slate-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-medium">Reorder Alert</span>
            <TrendingDown className="w-3.5 h-3.5" />
          </div>
          <p className="text-2xl font-bold text-amber-400 tabular-nums tracking-tight font-mono">
            {lowStockParts.length}
          </p>
          <div className="mt-1 text-[11px] text-slate-400">
            At or below ROP
          </div>
        </div>
      </div>

      {/* Critical Stock Alert Banner */}
      {criticalParts.length > 0 && (
        <div className="p-4 bg-rose-950/30 border border-rose-900/60 rounded">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-rose-900/40">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-rose-200">
                  Heavy Equipment Parts Shortage Alert ({criticalParts.length} SKUs below minimum)
                </h3>
                <p className="text-xs text-rose-300/80">
                  Critical vehicle components (pumps, injectors, undercarriage) are below safety buffer. Fleet customer downtime risk.
                </p>
              </div>
            </div>
            <button
              onClick={onAutoGeneratePO}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-rose-500 text-slate-950 hover:bg-rose-400 rounded transition-colors whitespace-nowrap self-start sm:self-center"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Draft Supplier Restock PO</span>
            </button>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="text-slate-400 border-b border-rose-900/30">
                  <th className="py-2 pr-4 font-medium">Part #</th>
                  <th className="py-2 pr-4 font-medium">Brand & Description</th>
                  <th className="py-2 pr-4 font-medium">Supported Machinery</th>
                  <th className="py-2 pr-4 font-medium text-right">In Stock</th>
                  <th className="py-2 pr-4 font-medium text-right">Safety Min</th>
                  <th className="py-2 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-900/20">
                {criticalParts.map((part) => (
                  <tr key={part.id} className="hover:bg-rose-900/10 transition-colors">
                    <td className="py-2 pr-4 font-mono font-medium text-rose-300">
                      <button onClick={() => onSelectPart(part)} className="hover:underline">
                        {part.partNumber}
                      </button>
                    </td>
                    <td className="py-2 pr-4 text-slate-200">
                      <span className="text-slate-400 block text-[10px]">{part.brand}</span>
                      <span className="truncate max-w-[220px] block">{part.name}</span>
                    </td>
                    <td className="py-2 pr-4 text-amber-300/90 font-mono text-[11px] truncate max-w-[200px]">
                      {part.compatibleVehicles.map((v) => `${v.make} ${v.model}`).join(', ')}
                    </td>
                    <td className="py-2 pr-4 text-right font-mono font-bold text-rose-400 tabular-nums">
                      {part.stockQuantity} {part.unitOfMeasure}
                    </td>
                    <td className="py-2 pr-4 text-right font-mono text-slate-400 tabular-nums">
                      {part.minStockLevel} {part.unitOfMeasure}
                    </td>
                    <td className="py-2 text-right">
                      <button
                        onClick={() => onOpenQuickAction('RECEIPT', part.id)}
                        className="px-2 py-0.5 text-[11px] font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded transition-colors whitespace-nowrap"
                      >
                        + Receive Delivery
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Main Grid: Left 2 Cols (Recent Ledger) + Right Col (Machinery Fleet Compatibility & Store Quick Ops) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Stock Movements & Sales Ledger */}
        <div className="lg:col-span-2 p-5 bg-slate-900/60 border border-slate-800 rounded">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Recent Store Sales & Stock Activity</h2>
              <p className="text-xs text-slate-400">Live transaction stream of customer counter sales and parts receipts</p>
            </div>
            <button
              onClick={() => onNavigateTab('movements')}
              className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors"
            >
              <span>Full Ledger</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-800/80">
            {recentTransactions.map((tx) => {
              const isSale = tx.type === 'SALE';
              const isReceipt = tx.type === 'RECEIPT';

              return (
                <div key={tx.id} className="py-3 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-7 h-7 rounded flex items-center justify-center shrink-0 mt-0.5 ${
                        isSale
                          ? 'bg-amber-500/10 text-amber-400'
                          : isReceipt
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {isReceipt ? (
                        <ArrowDownRight className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-white">
                          {tx.partNumber}
                        </span>
                        <span className="text-slate-600 text-xs">·</span>
                        <span className="text-xs text-slate-300 truncate max-w-[220px]">
                          {tx.partName}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{tx.reason}</p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                        <span>Ref: {tx.referenceNumber}</span>
                        {tx.workOrderOrMachine && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-amber-400/90 font-mono">
                              {tx.workOrderOrMachine}
                            </span>
                          </>
                        )}
                        <span aria-hidden="true">·</span>
                        <span>{formatDateTime(tx.timestamp)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p
                      className={`font-mono text-sm font-bold tabular-nums ${
                        isReceipt ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {tx.quantity > 0 ? `+${tx.quantity}` : tx.quantity}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono tabular-nums">
                      Balance: {tx.newStock}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Machinery Fleet Compatibility & Quick Operations */}
        <div className="space-y-6">
          {/* Quick Counter Operations */}
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded">
            <h2 className="text-sm font-semibold text-white mb-1">Store POS & Counter Operations</h2>
            <p className="text-xs text-slate-400 mb-3">Process sales or record deliveries</p>

            <button
              onClick={onOpenNewSale}
              className="w-full mb-2.5 py-2.5 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>+ Create Customer Sale & Invoice</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onOpenQuickAction('RECEIPT')}
                className="p-2.5 text-left bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded transition-colors group"
              >
                <div className="text-xs font-semibold text-emerald-400 group-hover:text-emerald-300">
                  + Receive Stock
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">PO delivery check-in</div>
              </button>

              <button
                onClick={() => onOpenQuickAction('ISSUE')}
                className="p-2.5 text-left bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded transition-colors group"
              >
                <div className="text-xs font-semibold text-rose-400 group-hover:text-rose-300">
                  - Workshop Issue
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Internal fleet rebuild</div>
              </button>

              <button
                onClick={() => onOpenQuickAction('ADJUSTMENT')}
                className="p-2.5 text-left bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded transition-colors group"
              >
                <div className="text-xs font-semibold text-amber-400 group-hover:text-amber-300">
                  ± Cycle Count
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Yard audit variance</div>
              </button>

              <button
                onClick={() => onNavigateTab('sales')}
                className="p-2.5 text-left bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded transition-colors group"
              >
                <div className="text-xs font-semibold text-sky-400 group-hover:text-sky-300">
                  Sales Reports
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Invoices & receivables</div>
              </button>
            </div>
          </div>

          {/* Machinery Fleet Brand Distribution */}
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded">
            <h2 className="text-sm font-semibold text-white mb-1">Supported Machinery Vehicles</h2>
            <p className="text-xs text-slate-400 mb-3">Inventory coverage by heavy equipment OEM make</p>

            <div className="space-y-3">
              {makeStats.map((item) => (
                <div key={item.make} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-200 font-medium">{item.make}</span>
                    <span className="font-mono text-slate-400 tabular-nums">
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{
                        width: `${Math.min(100, Math.max(10, (item.count / totalSKUs) * 100))}%`,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{item.count} compatible applications</span>
                    <span>Fleet ready</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
