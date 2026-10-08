import React, { useState } from 'react';
import {
  Truck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PurchaseOrder, Part } from '../types/inventory';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Language, getTranslation } from '../utils/i18n';

interface PurchaseOrdersViewProps {
  purchaseOrders: PurchaseOrder[];
  parts: Part[];
  onAutoGeneratePO: () => void;
  onReceivePO: (poId: string) => void;
  currentLang?: Language;
}

export const PurchaseOrdersView: React.FC<PurchaseOrdersViewProps> = ({
  purchaseOrders,
  parts,
  onAutoGeneratePO,
  onReceivePO,
  currentLang = 'am',
}) => {
  const t = getTranslation(currentLang);
  const currSymbol = t.currencySymbol;

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const needsReorderParts = parts.filter((p) => p.stockQuantity <= p.reorderPoint);

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-white">{t.poTitle}</h2>
          <p className="text-xs text-slate-400">
            {t.poSub}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {needsReorderParts.length > 0 && (
            <button
              onClick={onAutoGeneratePO}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors whitespace-nowrap shadow-sm"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>
                {t.btnAutoDraftPO} ({needsReorderParts.length} {currentLang === 'am' ? 'እጥረት ያለባቸው ዕቃዎች' : 'items'})
              </span>
            </button>
          )}
        </div>
      </div>

      {/* PO List */}
      {purchaseOrders.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/40 border border-slate-800 rounded">
          <Truck className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">
            {currentLang === 'am' ? 'ምንም የግዢ ትዕዛዞች አልተገኙም' : 'No purchase orders found'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {currentLang === 'am'
              ? 'መለዋወጫዎች ከዳግም ማዘዣ ወለል በታች ሲወርዱ በራስ-ሰር የግዢ ትዕዛዝ አዘጋጁ።'
              : 'Generate replenishment purchase orders when warehouse parts fall below their reorder point.'}
          </p>
          {needsReorderParts.length > 0 && (
            <button
              onClick={onAutoGeneratePO}
              className="mt-4 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors"
            >
              {t.btnAutoDraftPO}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {purchaseOrders.map((po) => {
            const isExpanded = expandedId === po.id;
            const isReceived = po.status === 'Received';

            return (
              <div
                key={po.id}
                className="bg-slate-900/60 border border-slate-800 rounded overflow-hidden"
              >
                <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded flex items-center justify-center shrink-0 mt-0.5 ${
                        isReceived
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      <Truck className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-white">
                          {po.poNumber}
                        </span>
                        <span className="text-slate-600 text-xs">·</span>
                        <span className="text-xs font-semibold text-slate-200">
                          {po.supplierName}
                        </span>
                        <span className="text-slate-600 text-xs">·</span>
                        <span
                          className={`text-xs font-semibold ${
                            isReceived
                              ? 'text-emerald-400'
                              : po.status === 'Sent'
                              ? 'text-sky-400'
                              : 'text-amber-400'
                          }`}
                        >
                          {isReceived
                            ? t.receivedDelivery
                            : po.status === 'Sent'
                            ? t.pendingReceipt
                            : po.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
                        <span>{t.expectedETA}: {formatDate(po.expectedDeliveryDate)}</span>
                        <span aria-hidden="true">·</span>
                        <span>{t.date}: {formatDate(po.createdAt)}</span>
                        <span aria-hidden="true">·</span>
                        <span>{po.items.length} {currentLang === 'am' ? 'የዕቃ አይነቶች' : 'line items'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end md:self-center">
                    <div className="text-right">
                      <p className="text-[11px] text-slate-400">{t.totalPOValue}</p>
                      <p className="font-mono text-sm font-bold text-emerald-400 tabular-nums">
                        {formatCurrency(po.totalAmount, currSymbol)}
                      </p>
                    </div>

                    {!isReceived && (
                      <button
                        onClick={() => onReceivePO(po.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors whitespace-nowrap"
                        title={t.btnReceiveDelivery}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t.btnReceiveDelivery}</span>
                      </button>
                    )}

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : po.id)}
                      className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                      title="ዝርዝር"
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
                  <div className="border-t border-slate-800/80 bg-slate-950/40 p-4">
                    <h4 className="text-xs font-semibold text-slate-300 mb-2">
                      {currentLang === 'am' ? 'የታዘዙ ዕቃዎች ዝርዝር' : 'Purchase Order Line Items'} ({po.items.length})
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="text-slate-400 border-b border-slate-800">
                            <th className="py-2 pr-4 font-medium">{t.colPartNumber}</th>
                            <th className="py-2 pr-4 font-medium">{t.colDescription}</th>
                            <th className="py-2 pr-4 font-medium text-right">{t.quantity}</th>
                            <th className="py-2 pr-4 font-medium text-right">{t.colUnitCost}</th>
                            <th className="py-2 pr-4 font-medium text-right">{t.subtotal}</th>
                            <th className="py-2 font-medium text-right">{t.invoiceStatus}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40 font-mono">
                          {po.items.map((it) => (
                            <tr key={it.partId}>
                              <td className="py-2 pr-4 text-white font-medium">
                                {it.partNumber}
                              </td>
                              <td className="py-2 pr-4 font-sans text-slate-300">
                                {it.partName}
                              </td>
                              <td className="py-2 pr-4 text-right tabular-nums text-white">
                                {it.quantity}
                              </td>
                              <td className="py-2 pr-4 text-right tabular-nums text-slate-400">
                                {formatCurrency(it.unitCost, currSymbol)}
                              </td>
                              <td className="py-2 pr-4 text-right tabular-nums text-slate-200">
                                {formatCurrency(it.quantity * it.unitCost, currSymbol)}
                              </td>
                              <td className="py-2 text-right font-sans">
                                <span className={isReceived ? 'text-emerald-400 font-medium' : 'text-amber-400'}>
                                  {isReceived ? t.receivedDelivery : t.pendingReceipt}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {po.notes && (
                      <p className="mt-3 text-xs text-slate-400 border-t border-slate-800/40 pt-2">
                        <strong className="text-slate-300">{currentLang === 'am' ? 'ማስታወሻ:' : 'Notes:'}</strong> {po.notes}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
