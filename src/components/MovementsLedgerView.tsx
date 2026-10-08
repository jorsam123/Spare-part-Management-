import React, { useState, useMemo } from 'react';
import {
  Search,
  Download,
  ArrowDownRight,
  ArrowUpRight,
  RefreshCw,
  SlidersHorizontal,
  History,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { StockTransaction, TransactionType } from '../types/inventory';
import { formatDateTime } from '../utils/formatters';

interface MovementsLedgerViewProps {
  transactions: StockTransaction[];
  onOpenQuickAction: (mode: 'RECEIPT' | 'ISSUE' | 'ADJUSTMENT') => void;
}

export const MovementsLedgerView: React.FC<MovementsLedgerViewProps> = ({
  transactions,
  onOpenQuickAction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (selectedType !== 'ALL' && tx.type !== selectedType) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchPart = tx.partNumber.toLowerCase().includes(q);
        const matchName = tx.partName.toLowerCase().includes(q);
        const matchRef = tx.referenceNumber.toLowerCase().includes(q);
        const matchUser = tx.performedBy.toLowerCase().includes(q);
        const matchReason = tx.reason.toLowerCase().includes(q);
        const matchMachine = tx.workOrderOrMachine?.toLowerCase().includes(q) || false;

        if (!matchPart && !matchName && !matchRef && !matchUser && !matchReason && !matchMachine) {
          return false;
        }
      }
      return true;
    });
  }, [transactions, searchQuery, selectedType]);

  const handleExportCSV = () => {
    const headers = [
      'Transaction ID',
      'Timestamp',
      'Type',
      'Part Number',
      'Part Name',
      'Quantity Change',
      'Previous Balance',
      'New Balance',
      'Reference #',
      'Work Order / Machine',
      'Operator',
      'Reason / Notes',
    ];

    const rows = filteredTransactions.map((tx) => [
      `"${tx.id}"`,
      `"${tx.timestamp}"`,
      `"${tx.type}"`,
      `"${tx.partNumber}"`,
      `"${tx.partName.replace(/"/g, '""')}"`,
      tx.quantity,
      tx.previousStock,
      tx.newStock,
      `"${tx.referenceNumber}"`,
      `"${tx.workOrderOrMachine || ''}"`,
      `"${tx.performedBy}"`,
      `"${tx.reason.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `partsvault_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by part #, reference (PO/WO), operator, reason..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Ledger CSV</span>
            </button>

            <button
              onClick={() => onOpenQuickAction('RECEIPT')}
              className="px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 hover:bg-emerald-950/60 rounded transition-colors whitespace-nowrap"
            >
              + Receive
            </button>
            <button
              onClick={() => onOpenQuickAction('ISSUE')}
              className="px-3 py-1.5 text-xs font-medium text-rose-400 bg-rose-950/40 border border-rose-800/60 hover:bg-rose-950/60 rounded transition-colors whitespace-nowrap"
            >
              - Issue
            </button>
          </div>
        </div>

        {/* Filter Tabs / Segmented Control (Interactive Filter Controls are allowed buttons) */}
        <div className="flex flex-wrap items-center gap-1 pt-2 border-t border-slate-800/80">
          <span className="text-[11px] text-slate-400 mr-2">Filter by Type:</span>
          {[
            { id: 'ALL', label: 'All Transactions' },
            { id: 'SALE', label: 'Store Sales (Invoices)' },
            { id: 'RECEIPT', label: 'Goods Receipts (PO)' },
            { id: 'ISSUE', label: 'Workshop Issues' },
            { id: 'ADJUSTMENT', label: 'Cycle Adjustments' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                selectedType === tab.id
                  ? 'bg-slate-800 text-amber-400 border border-slate-700'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Table */}
      {filteredTransactions.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/40 border border-slate-800 rounded">
          <History className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">No stock movement logs found</h3>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting your search criteria or record a new goods receipt or issuance.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-4 font-medium">Timestamp</th>
                  <th className="py-3 px-4 font-medium">Type</th>
                  <th className="py-3 px-4 font-medium">Part Number & Name</th>
                  <th className="py-3 px-4 font-medium">Reference #</th>
                  <th className="py-3 px-4 font-medium">Work Order / Machine</th>
                  <th className="py-3 px-4 font-medium text-right">Quantity</th>
                  <th className="py-3 px-4 font-medium text-right">Balance</th>
                  <th className="py-3 px-4 font-medium">Operator & Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredTransactions.map((tx) => {
                  const isReceipt = tx.quantity > 0;
                  return (
                    <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Timestamp */}
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {formatDateTime(tx.timestamp)}
                      </td>

                      {/* Type (Clean unboxed text) */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`font-semibold text-xs ${
                            tx.type === 'RECEIPT'
                              ? 'text-emerald-400'
                              : tx.type === 'ISSUE'
                              ? 'text-rose-400'
                              : 'text-amber-400'
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>

                      {/* Part Number & Name */}
                      <td className="py-3 px-4 max-w-[240px]">
                        <span className="font-mono font-semibold text-white block">
                          {tx.partNumber}
                        </span>
                        <span className="text-[11px] text-slate-300 truncate block">
                          {tx.partName}
                        </span>
                      </td>

                      {/* Reference # */}
                      <td className="py-3 px-4 font-mono text-xs text-slate-300 whitespace-nowrap">
                        {tx.referenceNumber}
                      </td>

                      {/* Machine / Work Order */}
                      <td className="py-3 px-4 text-slate-300 text-xs truncate max-w-[180px]">
                        {tx.workOrderOrMachine || '—'}
                      </td>

                      {/* Quantity Changed */}
                      <td className="py-3 px-4 text-right font-mono text-sm font-bold tabular-nums whitespace-nowrap">
                        <span className={isReceipt ? 'text-emerald-400' : 'text-rose-400'}>
                          {isReceipt ? `+${tx.quantity}` : tx.quantity}
                        </span>
                      </td>

                      {/* Stock Balance */}
                      <td className="py-3 px-4 text-right font-mono text-xs text-slate-300 tabular-nums whitespace-nowrap">
                        <span className="text-slate-400 text-[10px] block">
                          prev {tx.previousStock}
                        </span>
                        <span className="font-semibold text-white">
                          now {tx.newStock}
                        </span>
                      </td>

                      {/* Operator & Reason */}
                      <td className="py-3 px-4 max-w-[220px]">
                        <p className="text-xs text-slate-200 font-medium truncate">{tx.performedBy}</p>
                        <p className="text-[11px] text-slate-400 truncate">{tx.reason}</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
