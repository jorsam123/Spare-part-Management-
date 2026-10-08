import React, { useState, useMemo } from 'react';
import {
  Search,
  Download,
  Printer,
  ChevronDown,
  ChevronUp,
  DollarSign,
  TrendingUp,
  Clock,
  Receipt,
} from 'lucide-react';
import { SaleInvoice } from '../types/inventory';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import { Language, getTranslation } from '../utils/i18n';

interface SalesInvoicesViewProps {
  invoices: SaleInvoice[];
  onOpenNewSale: () => void;
  currentLang?: Language;
}

export const SalesInvoicesView: React.FC<SalesInvoicesViewProps> = ({
  invoices,
  onOpenNewSale,
  currentLang = 'am',
}) => {
  const t = getTranslation(currentLang);
  const currSymbol = t.currencySymbol;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [printingInvoice, setPrintingInvoice] = useState<SaleInvoice | null>(null);

  const totalRevenue = invoices
    .filter((inv) => inv.status !== 'Cancelled')
    .reduce((acc, inv) => acc + inv.grandTotal, 0);

  const totalGrossProfit = invoices
    .filter((inv) => inv.status !== 'Cancelled')
    .reduce((acc, inv) => acc + inv.grossProfit, 0);

  const pendingReceivables = invoices
    .filter((inv) => inv.status === 'Pending Net 30')
    .reduce((acc, inv) => acc + inv.grandTotal, 0);

  const overallMargin = totalRevenue > 0 ? (totalGrossProfit / totalRevenue) * 100 : 0;

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      if (selectedStatus !== 'ALL' && inv.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNum = inv.invoiceNumber.toLowerCase().includes(q);
        const matchCust = inv.customer.name.toLowerCase().includes(q);
        const matchComp = inv.customer.company.toLowerCase().includes(q);
        const matchMach = inv.machineryVehicle.toLowerCase().includes(q);
        const matchItem = inv.items.some((it) =>
          it.partNumber.toLowerCase().includes(q) || it.partName.toLowerCase().includes(q)
        );

        if (!matchNum && !matchCust && !matchComp && !matchMach && !matchItem) {
          return false;
        }
      }
      return true;
    });
  }, [invoices, selectedStatus, searchQuery]);

  const handleExportCSV = () => {
    const headers = [
      'Invoice #',
      'Date',
      'Customer',
      'Company',
      'Machinery Vehicle',
      'Payment Method',
      'Status',
      'Subtotal (ETB)',
      'Discount',
      'Tax',
      'Grand Total (ETB)',
      'Gross Profit (ETB)',
      'Cashier',
    ];

    const rows = filtered.map((inv) => [
      `"${inv.invoiceNumber}"`,
      `"${inv.createdAt}"`,
      `"${inv.customer.name}"`,
      `"${inv.customer.company}"`,
      `"${inv.machineryVehicle}"`,
      `"${inv.paymentMethod}"`,
      `"${inv.status}"`,
      inv.subtotal.toFixed(2),
      inv.discountTotal.toFixed(2),
      inv.taxAmount.toFixed(2),
      inv.grandTotal.toFixed(2),
      inv.grossProfit.toFixed(2),
      `"${inv.cashier}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `heavyequip_sales_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Financial Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">{t.statStoreRevenue}</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-xl font-bold text-emerald-400 tabular-nums font-mono tracking-tight">
            {formatCurrency(totalRevenue, currSymbol)}
          </p>
          <div className="mt-1 text-[11px] text-slate-400">
            {invoices.length} {t.statOrdersFulfilled}
          </div>
        </div>

        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">{t.statSalesProfit}</span>
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-xl font-bold text-amber-400 tabular-nums font-mono tracking-tight">
            {formatCurrency(totalGrossProfit, currSymbol)}
          </p>
          <div className="mt-1 text-[11px] text-slate-400 font-mono">
            {overallMargin.toFixed(1)}% {t.statGrossMargin}
          </div>
        </div>

        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">{t.statReceivables}</span>
            <Clock className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <p className="text-xl font-bold text-sky-400 tabular-nums font-mono tracking-tight">
            {formatCurrency(pendingReceivables, currSymbol)}
          </p>
          <div className="mt-1 text-[11px] text-slate-400">
            {t.statCommercialCredit}
          </div>
        </div>

        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">{t.counterPOSOps}</span>
            <Receipt className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <button
            onClick={onOpenNewSale}
            className="w-full mt-2 py-2 px-3 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors shadow-sm text-center"
          >
            {t.btnCreateSaleInvoice}
          </button>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={currentLang === 'am' ? 'በደረሰኝ #፣ በደንበኛ ስም፣ በማሽን ሞዴል ወይም በዕቃ ፈልግ...' : 'Search by invoice #, customer, machinery model, or part SKU...'}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-0.5 bg-slate-950 border border-slate-800 rounded text-xs">
            {['ALL', 'Paid', 'Pending Net 30', 'Quote / Estimate'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  selectedStatus === st
                    ? 'bg-slate-800 text-amber-400 font-medium'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st === 'ALL'
                  ? currentLang === 'am' ? 'ሁሉም ደረሰኞች' : 'All Invoices'
                  : st === 'Paid'
                  ? t.statusPaid
                  : st === 'Pending Net 30'
                  ? t.statusPendingNet30
                  : t.statusQuote}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.btnExportCSV}</span>
          </button>
        </div>
      </div>

      {/* Invoice List */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/40 border border-slate-800 rounded">
          <Receipt className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">
            {currentLang === 'am' ? 'ምንም የሽያጭ ደረሰኞች አልተገኙም' : 'No sales invoices found'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {currentLang === 'am'
              ? 'በካውንተር ዕቃዎችን ይሽጡ ወይም የኮንትራክተሮችን የብድር ሂሳብ ያስተዳድሩ።'
              : 'Sell spare parts over the counter or bill heavy machinery fleet contractor accounts.'}
          </p>
          <button
            onClick={onOpenNewSale}
            className="mt-4 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors"
          >
            {t.btnCreateSaleInvoice}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inv) => {
            const isExpanded = expandedId === inv.id;

            return (
              <div
                key={inv.id}
                className="bg-slate-900/60 border border-slate-800 rounded overflow-hidden"
              >
                <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded flex items-center justify-center shrink-0 mt-0.5 ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      <Receipt className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-white">
                          {inv.invoiceNumber}
                        </span>
                        <span className="text-slate-600 text-xs">·</span>
                        <span className="text-xs font-semibold text-slate-200">
                          {inv.customer.company}
                        </span>
                        <span className="text-slate-600 text-xs">·</span>
                        <span
                          className={`text-xs font-semibold ${
                            inv.status === 'Paid' ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {inv.status === 'Paid' ? t.statusPaid : inv.status === 'Pending Net 30' ? t.statusPendingNet30 : t.statusQuote}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
                        <span className="text-amber-400/90 font-mono font-medium">
                          {inv.machineryVehicle}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{inv.paymentMethod}</span>
                        <span aria-hidden="true">·</span>
                        <span>{formatDateTime(inv.createdAt)}</span>
                        <span aria-hidden="true">·</span>
                        <span>{t.cashier}: {inv.cashier}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end md:self-center">
                    <div className="text-right">
                      <p className="text-[11px] text-slate-400">{t.grandTotal}</p>
                      <p className="font-mono text-sm font-bold text-emerald-400 tabular-nums">
                        {formatCurrency(inv.grandTotal, currSymbol)}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {currentLang === 'am' ? 'ትርፍ' : 'Profit'}: {formatCurrency(inv.grossProfit, currSymbol)}
                      </span>
                    </div>

                    <button
                      onClick={() => setPrintingInvoice(inv)}
                      className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                      title={t.btnPrintInvoice}
                    >
                      <Printer className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : inv.id)}
                      className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                      title="ዝርዝር አሳይ"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-slate-800/80 bg-slate-950/50 p-4">
                    <h4 className="text-xs font-semibold text-slate-300 mb-2">
                      {t.orderLines} ({inv.items.length})
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="text-slate-400 border-b border-slate-800">
                            <th className="py-2 pr-4 font-medium">{t.colPartNumber}</th>
                            <th className="py-2 pr-4 font-medium">{t.colDescription}</th>
                            <th className="py-2 pr-4 font-medium text-right">{t.quantity}</th>
                            <th className="py-2 pr-4 font-medium text-right">{t.unitPrice}</th>
                            <th className="py-2 pr-4 font-medium text-right">{t.subtotal}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40 font-mono">
                          {inv.items.map((it, idx) => (
                            <tr key={idx}>
                              <td className="py-2 pr-4 text-white font-medium">
                                {it.partNumber}
                              </td>
                              <td className="py-2 pr-4 font-sans text-slate-300">
                                <span className="text-slate-400 text-[11px] block">{it.brand}</span>
                                <span>{it.partName}</span>
                              </td>
                              <td className="py-2 pr-4 text-right tabular-nums text-white">
                                {it.quantity}
                              </td>
                              <td className="py-2 pr-4 text-right tabular-nums text-slate-400">
                                {formatCurrency(it.unitPrice, currSymbol)}
                              </td>
                              <td className="py-2 pr-4 text-right tabular-nums text-slate-200">
                                {formatCurrency(it.lineTotal, currSymbol)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {inv.notes && (
                      <p className="mt-3 text-xs text-slate-400 border-t border-slate-800/40 pt-2">
                        <strong className="text-slate-300">{currentLang === 'am' ? 'የማስረከቢያ ማስታወሻ:' : 'Notes:'}</strong> {inv.notes}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Printable Invoice Voucher Modal */}
      {printingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-white text-black p-6 rounded shadow-2xl overflow-y-auto max-h-[90vh] font-sans">
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-4">
              <div>
                <h2 className="text-xl font-black tracking-tight text-neutral-900 uppercase">
                  {t.companyName}
                </h2>
                <p className="text-xs text-neutral-600">
                  {t.companySubtitle}
                </p>
                <p className="text-[11px] text-neutral-500">
                  {t.companyPhone}
                </p>
              </div>
              <div className="text-right">
                <span className="font-mono text-lg font-black block">
                  {printingInvoice.invoiceNumber}
                </span>
                <span className="text-xs text-neutral-600">
                  {t.date}: {new Date(printingInvoice.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Bill To & Machinery Fitment */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-xs pb-4 border-b border-neutral-300">
              <div>
                <strong className="block uppercase text-[10px] text-neutral-500 mb-1">
                  {t.customerAccount}
                </strong>
                <p className="font-bold text-sm text-neutral-900">{printingInvoice.customer.company}</p>
                <p className="text-neutral-700">{currentLang === 'am' ? 'ተወካይ:' : 'Attn:'} {printingInvoice.customer.name}</p>
                <p className="text-neutral-600">{printingInvoice.customer.phone}</p>
                {printingInvoice.customer.taxNumber && (
                  <p className="text-neutral-500 font-mono text-[10px]">
                    TIN: {printingInvoice.customer.taxNumber}
                  </p>
                )}
              </div>

              <div>
                <strong className="block uppercase text-[10px] text-neutral-500 mb-1">
                  {t.targetVehicle}
                </strong>
                <p className="font-bold text-sm text-neutral-900">{printingInvoice.machineryVehicle}</p>
                <p className="text-neutral-600 mt-1">{t.paymentMethod}: {printingInvoice.paymentMethod}</p>
                <p className="text-neutral-600">{t.invoiceStatus}: <strong className="text-black">{printingInvoice.status}</strong></p>
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-xs text-left mb-4 border-collapse">
              <thead>
                <tr className="border-b-2 border-black font-bold">
                  <th className="py-2 pr-3">{t.colPartNumber}</th>
                  <th className="py-2 pr-3">{t.colDescription}</th>
                  <th className="py-2 pr-3 text-right">{t.quantity}</th>
                  <th className="py-2 pr-3 text-right">{t.unitPrice}</th>
                  <th className="py-2 text-right">{t.subtotal}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 font-mono text-neutral-800">
                {printingInvoice.items.map((it, idx) => (
                  <tr key={idx}>
                    <td className="py-2 pr-3 font-bold text-black">{it.partNumber}</td>
                    <td className="py-2 pr-3 font-sans text-neutral-700">
                      {it.partName} ({it.brand})
                    </td>
                    <td className="py-2 pr-3 text-right font-bold">{it.quantity}</td>
                    <td className="py-2 pr-3 text-right">{formatCurrency(it.unitPrice, currSymbol)}</td>
                    <td className="py-2 text-right font-bold">{formatCurrency(it.lineTotal, currSymbol)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end border-t-2 border-black pt-3 mb-6">
              <div className="w-64 space-y-1 font-mono text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>{t.subtotal}:</span>
                  <span>{formatCurrency(printingInvoice.subtotal, currSymbol)}</span>
                </div>
                {printingInvoice.discountTotal > 0 && (
                  <div className="flex justify-between text-neutral-600">
                    <span>{currentLang === 'am' ? 'ቅናሽ:' : 'Discount:'}</span>
                    <span>-{formatCurrency(printingInvoice.discountTotal, currSymbol)}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-600">
                  <span>{t.salesTax}</span>
                  <span>{formatCurrency(printingInvoice.taxAmount, currSymbol)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-black pt-1 border-t border-neutral-300">
                  <span>{t.grandTotal}</span>
                  <span>{formatCurrency(printingInvoice.grandTotal, currSymbol)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t border-neutral-300 print:hidden">
              <button
                onClick={() => setPrintingInvoice(null)}
                className="px-4 py-1.5 text-xs text-neutral-600 hover:text-black rounded"
              >
                {t.close}
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-1.5 text-xs font-bold text-white bg-black hover:bg-neutral-800 rounded"
              >
                {t.btnPrintInvoice}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
