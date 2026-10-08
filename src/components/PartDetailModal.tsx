import React from 'react';
import {
  X,
  MapPin,
  Truck,
  Printer,
  Edit2,
  Trash2,
  ShoppingCart,
  AlertTriangle,
  History,
  Scale,
} from 'lucide-react';
import { Part, StockTransaction } from '../types/inventory';
import {
  formatCurrency,
  formatDateTime,
  getStockStatus,
} from '../utils/formatters';
import { Language, getTranslation, translateCategory, translateVehicleType, translateWarehouse } from '../utils/i18n';

interface PartDetailModalProps {
  part: Part | null;
  onClose: () => void;
  onEdit: (part: Part) => void;
  onDelete: (partId: string) => void;
  onOpenQuickAction: (mode: 'RECEIPT' | 'ISSUE' | 'ADJUSTMENT', partId?: string) => void;
  onSellPart: (part: Part) => void;
  onPrintLabel: (part: Part) => void;
  transactions: StockTransaction[];
  currentLang?: Language;
}

export const PartDetailModal: React.FC<PartDetailModalProps> = ({
  part,
  onClose,
  onEdit,
  onDelete,
  onOpenQuickAction,
  onSellPart,
  onPrintLabel,
  transactions,
  currentLang = 'am',
}) => {
  if (!part) return null;

  const t = getTranslation(currentLang);
  const currSymbol = t.currencySymbol;

  const available = part.stockQuantity - part.reservedQuantity;
  const { status, label, colorClass } = getStockStatus(part, currentLang);
  const partTransactions = transactions.filter((t) => t.partId === part.id);

  const profitPerUnit = part.sellingPrice - part.unitCost;
  const marginPercent = part.sellingPrice > 0 ? (profitPerUnit / part.sellingPrice) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-start justify-between bg-slate-950/60">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xl font-black text-white">
                {part.partNumber}
              </span>
              <span className="text-slate-600 text-xs">·</span>
              <span className="text-xs font-semibold text-amber-400">
                {part.brand}
              </span>
              <span className="text-slate-600 text-xs">·</span>
              <span className={`text-xs font-semibold ${colorClass}`}>
                {label}
              </span>
            </div>
            {part.oemPartNumber && (
              <p className="font-mono text-xs text-slate-400 mt-0.5">
                {t.crossRefOEM} {part.oemPartNumber}
              </p>
            )}
            <h3 className="text-sm font-semibold text-slate-200 mt-1">{part.name}</h3>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPrintLabel(part)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
              title={t.btnPrint}
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(part);
              }}
              className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors"
              title={t.btnEdit}
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="px-6 py-5 overflow-y-auto space-y-6">
          {/* Critical Shortage Alert */}
          {status === 'Critical' && (
            <div className="p-3 bg-rose-950/40 border border-rose-900/60 rounded flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-rose-300">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>
                  {currentLang === 'am'
                    ? `በመጋዘን ያለው ክምችት (${part.stockQuantity} ${part.unitOfMeasure}) ከዝቅተኛ የደህንነት መጠን (${part.minStockLevel}) በታች ነው። በአስቸኳይ ያዝዙ።`
                    : `Physical stock (${part.stockQuantity} ${part.unitOfMeasure}) is below the minimum safety threshold (${part.minStockLevel}). Reorder immediately.`}
                </span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenQuickAction('RECEIPT', part.id);
                }}
                className="px-2.5 py-1 text-xs font-semibold text-slate-950 bg-rose-400 hover:bg-rose-300 rounded transition-colors whitespace-nowrap ml-3"
              >
                {t.btnReceiveStock}
              </button>
            </div>
          )}

          {/* Pricing & Commercial Margins Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded">
              <span className="text-[11px] text-slate-400 block mb-1">{t.retailSellingPrice}</span>
              <p className="font-mono text-xl font-bold text-emerald-400 tabular-nums">
                {formatCurrency(part.sellingPrice, currSymbol)}
              </p>
              <span className="text-[10px] text-slate-400">{currentLang === 'am' ? 'የካውንተር መሸጫ' : 'Counter price'}</span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded">
              <span className="text-[11px] text-slate-400 block mb-1">{t.wholesaleFleetPrice}</span>
              <p className="font-mono text-xl font-bold text-amber-300 tabular-nums">
                {formatCurrency(part.wholesalePrice, currSymbol)}
              </p>
              <span className="text-[10px] text-slate-400">{currentLang === 'am' ? 'የኮንትራክተሮች የጅምላ ዋጋ' : 'Contractor trade'}</span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded">
              <span className="text-[11px] text-slate-400 block mb-1">{t.storePurchaseCost}</span>
              <p className="font-mono text-xl font-bold text-slate-200 tabular-nums">
                {formatCurrency(part.unitCost, currSymbol)}
              </p>
              <span className="text-[10px] text-slate-400">
                {t.margin}: {marginPercent.toFixed(1)}% (+{formatCurrency(profitPerUnit, currSymbol)})
              </span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded">
              <span className="text-[11px] text-slate-400 block mb-1">{t.stockOnHand}</span>
              <p className={`font-mono text-xl font-bold tabular-nums ${colorClass}`}>
                {part.stockQuantity}{' '}
                <span className="text-xs font-normal text-slate-400 font-sans">
                  {part.unitOfMeasure}
                </span>
              </p>
              <span className="text-[10px] text-slate-400">
                {available} {t.availableForSale}
              </span>
            </div>
          </div>

          {/* Compatible Vehicles */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.fitsMachineryVehicles}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800 text-[11px]">
                    <th className="py-1.5 pr-3 font-medium">{currentLang === 'am' ? 'አምራች / ብራንድ' : 'Make'}</th>
                    <th className="py-1.5 pr-3 font-medium">{currentLang === 'am' ? 'ሞዴል / ሲሪየስ' : 'Model / Series'}</th>
                    <th className="py-1.5 pr-3 font-medium">{currentLang === 'am' ? 'የማሽኑ ዓይነት' : 'Equipment Type'}</th>
                    <th className="py-1.5 font-medium">{currentLang === 'am' ? 'የሞተር / ሴሪያል መረጃ' : 'Engine / Serial Info'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                  {part.compatibleVehicles.map((v, idx) => (
                    <tr key={idx}>
                      <td className="py-2 pr-3 font-bold text-amber-300">{v.make}</td>
                      <td className="py-2 pr-3 text-white font-medium">{v.model}</td>
                      <td className="py-2 pr-3 font-sans text-slate-300">
                        {translateVehicleType(v.vehicleType, currentLang)}
                      </td>
                      <td className="py-2 text-slate-400">{v.engineModel || (currentLang === 'am' ? 'ሁሉም ሴሪያሎች' : 'All serials')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-300">{t.technicalDescription}</h4>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded border border-slate-800/80">
              {part.description}
            </p>
            {part.notes && (
              <p className="text-xs text-slate-400 bg-slate-950/40 p-3 rounded border border-slate-800/60">
                <strong className="text-slate-300">{t.storageAndHandling}:</strong> {part.notes}
              </p>
            )}
          </div>

          {/* Storage Location & Weight Logistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.storageLocation}</span>
              </div>
              <p className="font-mono text-sm font-bold text-amber-400">
                {translateWarehouse(part.location.warehouse, currentLang)}
              </p>
              <div className="grid grid-cols-4 gap-2 pt-1 text-center font-mono text-xs">
                <div className="p-1.5 bg-slate-900 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-sans">{t.aisle}</span>
                  <span className="text-white font-bold">{part.location.aisle}</span>
                </div>
                <div className="p-1.5 bg-slate-900 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-sans">{t.rack}</span>
                  <span className="text-white font-bold">{part.location.rack}</span>
                </div>
                <div className="p-1.5 bg-slate-900 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-sans">{t.shelf}</span>
                  <span className="text-white font-bold">{part.location.shelf}</span>
                </div>
                <div className="p-1.5 bg-slate-900 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-sans">{t.bin}</span>
                  <span className="text-white font-bold">{part.location.bin}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Scale className="w-3.5 h-3.5 text-sky-400" />
                <span>{t.weightAndLogistics}</span>
              </div>
              <p className="text-xs font-medium text-white">
                {t.supplier}: <span className="text-slate-300">{part.supplier.name}</span>
              </p>
              <div className="space-y-1 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>{currentLang === 'am' ? 'የዕቃው ክብደት:' : 'Part Weight:'}</span>
                  <span className="font-mono text-white font-bold">{part.weightKg} {currentLang === 'am' ? 'ኪ.ግ' : 'kg'}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.leadTime}:</span>
                  <span className="font-mono text-slate-200">
                    {part.supplier.leadTimeDays} {currentLang === 'am' ? 'የሥራ ቀናት' : 'days'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{currentLang === 'am' ? 'የአቅራቢው ኮድ:' : 'Vendor Part #:'}</span>
                  <span className="font-mono text-slate-200">
                    {part.supplier.supplierPartNumber}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <History className="w-3.5 h-3.5 text-slate-400" />
              <span>{t.movementHistory} ({part.partNumber})</span>
            </div>
            {partTransactions.length === 0 ? (
              <p className="text-xs text-slate-400 italic p-3 bg-slate-950/40 rounded border border-slate-800">
                {currentLang === 'am' ? 'ምንም የተመዘገበ እንቅስቃሴ የለም' : 'No recorded transactions yet.'}
              </p>
            ) : (
              <div className="divide-y divide-slate-800/80 bg-slate-950/60 border border-slate-800 rounded overflow-hidden">
                {partTransactions.map((tx) => (
                  <div key={tx.id} className="p-3 text-xs flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold ${
                            tx.type === 'SALE'
                              ? 'text-amber-400'
                              : tx.type === 'RECEIPT'
                              ? 'text-emerald-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {tx.type === 'SALE' ? (currentLang === 'am' ? 'ሽያጭ' : 'SALE') : tx.type === 'RECEIPT' ? (currentLang === 'am' ? 'ገቢ' : 'RECEIPT') : tx.type}
                        </span>
                        <span className="text-slate-600">·</span>
                        <span className="font-mono text-slate-300">{tx.referenceNumber}</span>
                        <span className="text-slate-600">·</span>
                        <span className="text-slate-400">{formatDateTime(tx.timestamp)}</span>
                      </div>
                      <p className="text-slate-400 mt-0.5">{tx.reason}</p>
                    </div>
                    <div className="text-right font-mono tabular-nums">
                      <span
                        className={`font-bold ${
                          tx.quantity > 0 ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {tx.quantity > 0 ? `+${tx.quantity}` : tx.quantity}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {currentLang === 'am' ? 'ቀሪ' : 'bal'} {tx.newStock}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              if (window.confirm(currentLang === 'am' ? `${part.partNumber} ከካታሎግ ይሰረዝ?` : `Delete ${part.partNumber}?`)) {
                onDelete(part.id);
                onClose();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.btnDelete}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenQuickAction('RECEIPT', part.id);
              }}
              className="px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 hover:bg-emerald-950/60 rounded transition-colors"
            >
              {t.btnReceiveStock}
            </button>

            <button
              onClick={() => {
                onClose();
                onSellPart(part);
              }}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors shadow-sm"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{t.btnSellAtPOS}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
