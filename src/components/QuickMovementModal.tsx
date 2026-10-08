import React, { useState, useEffect, useMemo } from 'react';
import { X, ArrowDownRight, ArrowUpRight, RefreshCw, AlertTriangle } from 'lucide-react';
import { Part, TransactionType, StockTransaction } from '../types/inventory';
import { formatLocation } from '../utils/formatters';
import { AppUser } from '../utils/storage';
import { Language, getTranslation } from '../utils/i18n';

interface QuickMovementModalProps {
  isOpen: boolean;
  mode: TransactionType;
  parts: Part[];
  preselectedPartId?: string;
  currentUser: AppUser;
  onClose: () => void;
  onSubmit: (transaction: Omit<StockTransaction, 'id' | 'timestamp'>) => void;
  currentLang?: Language;
}

export const QuickMovementModal: React.FC<QuickMovementModalProps> = ({
  isOpen,
  mode,
  parts,
  preselectedPartId,
  currentUser,
  onClose,
  onSubmit,
  currentLang = 'am',
}) => {
  const t = getTranslation(currentLang);

  const [selectedPartId, setSelectedPartId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [workOrderOrMachine, setWorkOrderOrMachine] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (preselectedPartId) {
      setSelectedPartId(preselectedPartId);
    } else if (parts.length > 0 && !selectedPartId) {
      setSelectedPartId(parts[0].id);
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    if (mode === 'RECEIPT') {
      setReferenceNumber(`PO-2026-${randomSuffix}`);
      setReason(currentLang === 'am' ? 'የአቅራቢ ዕቃ ርክክብ ተረጋግጦ ቢን ውስጥ ገብቷል' : 'Supplier delivery verified and stored in bin');
    } else if (mode === 'ISSUE') {
      setReferenceNumber(`WO-${randomSuffix}`);
      setReason(currentLang === 'am' ? 'ለታቀደ የማሽነሪ ጥገና ወጪ ተደርጓል' : 'Issued for scheduled equipment maintenance');
    } else {
      setReferenceNumber(`CYCLE-${randomSuffix}`);
      setReason(currentLang === 'am' ? 'የመጋዘን ቆጠራ ልዩነት ማስተካከያ' : 'Physical audit cycle count adjustment');
    }

    setQuantity(1);
    setError('');
  }, [isOpen, mode, preselectedPartId, parts, currentLang]);

  const selectedPart = useMemo(() => {
    return parts.find((p) => p.id === selectedPartId) || parts[0];
  }, [parts, selectedPartId]);

  if (!isOpen || !selectedPart) return null;

  const prevStock = selectedPart.stockQuantity;
  let newStock = prevStock;
  let signedQty = quantity;

  if (mode === 'RECEIPT') {
    signedQty = Math.abs(quantity);
    newStock = prevStock + signedQty;
  } else if (mode === 'ISSUE') {
    signedQty = -Math.abs(quantity);
    newStock = Math.max(0, prevStock - Math.abs(quantity));
  } else if (mode === 'ADJUSTMENT') {
    signedQty = quantity;
    newStock = Math.max(0, prevStock + quantity);
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceNumber.trim()) {
      setError(currentLang === 'am' ? 'የማመሳከሪያ ቁጥር ማስገባት ግዴታ ነው (PO# / WO#)' : 'Reference number is required (PO#, WO#, etc.)');
      return;
    }

    if (mode === 'ISSUE') {
      if (Math.abs(quantity) > selectedPart.stockQuantity) {
        setError(
          currentLang === 'am'
            ? `${quantity} ዕቃ ማውጣት አይቻልም። በመጋዘን ያለው ${selectedPart.stockQuantity} ብቻ ነው።`
            : `Cannot issue ${quantity} units. Only ${selectedPart.stockQuantity} physical units in stock.`
        );
        return;
      }
    }

    onSubmit({
      partId: selectedPart.id,
      partNumber: selectedPart.partNumber,
      partName: selectedPart.name,
      type: mode,
      quantity: signedQty,
      previousStock: prevStock,
      newStock: newStock,
      referenceNumber: referenceNumber.trim(),
      workOrderOrMachine: workOrderOrMachine.trim() || undefined,
      performedBy: `${currentUser.name} (${currentUser.role})`,
      reason: reason.trim() || `${mode} recorded in system`,
      toLocation: `${selectedPart.location.warehouse} / ${selectedPart.location.aisle}-${selectedPart.location.bin}`,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-7 h-7 rounded flex items-center justify-center ${
                mode === 'RECEIPT'
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : mode === 'ISSUE'
                  ? 'bg-rose-500/10 text-rose-400'
                  : 'bg-amber-500/10 text-amber-400'
              }`}
            >
              {mode === 'RECEIPT' ? (
                <ArrowDownRight className="w-4 h-4" />
              ) : mode === 'ISSUE' ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                {mode === 'RECEIPT'
                  ? (currentLang === 'am' ? 'የዕቃዎች ርክክብ / ገቢ' : 'Goods Receipt / Stock Check-In')
                  : mode === 'ISSUE'
                  ? (currentLang === 'am' ? 'የመለዋወጫ ወጪ / ለሥራ ማስረከብ' : 'Part Issuance / Workshop Check-Out')
                  : (currentLang === 'am' ? 'የክምችት ቆጠራ ልዩነት ማስተካከያ' : 'Physical Cycle Count Adjustment')}
              </h3>
              <p className="text-xs text-slate-400">
                {t.cashier}: <span className="text-slate-200">{currentUser.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-950/40 border border-rose-900/60 rounded text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              {currentLang === 'am' ? 'መለዋወጫ ይምረጡ' : 'Select Spare Part'}
            </label>
            <select
              value={selectedPartId}
              onChange={(e) => setSelectedPartId(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded font-mono text-white text-xs focus:outline-none focus:border-amber-400"
            >
              {parts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.partNumber} — {p.name} ({currentLang === 'am' ? 'ክምችት:' : 'Stock:'} {p.stockQuantity} {p.unitOfMeasure})
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">{t.storageLocation}</span>
              <span className="font-mono text-amber-400 font-medium">
                {formatLocation(selectedPart.location)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[11px]">{t.stockOnHand}</span>
              <span className="font-mono font-bold text-white text-sm tabular-nums">
                {selectedPart.stockQuantity} {selectedPart.unitOfMeasure}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                {mode === 'ADJUSTMENT'
                  ? (currentLang === 'am' ? 'የማስተካከያ መጠን (±)' : 'Adjustment Offset (±)')
                  : (currentLang === 'am' ? 'የእንቅስቃሴ ብዛት' : 'Quantity to Move')}
              </label>
              <input
                type="number"
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded font-mono text-white text-xs focus:outline-none focus:border-amber-400"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                {currentLang === 'am' ? 'መለኪያ:' : 'Units:'} {selectedPart.unitOfMeasure}
              </span>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                {currentLang === 'am' ? 'የማመሳከሪያ ቁጥር (PO / WO / ሰነድ)' : 'Reference # (PO / WO)'} <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="e.g. PO-8902 or WO-4410"
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded font-mono text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              {currentLang === 'am' ? 'የታሰበለት ማሽነሪ / የሥራ ቦታ (አማራጭ)' : 'Destination Machine / Project'}
            </label>
            <input
              type="text"
              value={workOrderOrMachine}
              onChange={(e) => setWorkOrderOrMachine(e.target.value)}
              placeholder="e.g. Caterpillar 336D Excavator (Machine #04)"
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-white text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              {currentLang === 'am' ? 'ምክንያት / ማስታወሻ' : 'Transaction Reason'}
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. 500-hr planned service, emergency hydraulic repair"
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-white text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Balance Preview */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded flex items-center justify-between font-mono text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] font-sans">
                {currentLang === 'am' ? 'የቀድሞ ክምችት' : 'Current Balance'}
              </span>
              <span className="text-slate-300 tabular-nums">{prevStock}</span>
            </div>
            <div className="text-center">
              <span className="text-slate-400 block text-[10px] font-sans">
                {currentLang === 'am' ? 'ልዩነት' : 'Delta'}
              </span>
              <span
                className={`font-bold tabular-nums ${
                  signedQty > 0
                    ? 'text-emerald-400'
                    : signedQty < 0
                    ? 'text-rose-400'
                    : 'text-slate-400'
                }`}
              >
                {signedQty > 0 ? `+${signedQty}` : signedQty}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px] font-sans">
                {currentLang === 'am' ? 'አዲስ ቀሪ ክምችት' : 'Projected Balance'}
              </span>
              <span
                className={`font-bold tabular-nums text-sm ${
                  newStock < selectedPart.minStockLevel ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {newStock} {selectedPart.unitOfMeasure}
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-xs font-bold rounded transition-colors shadow-sm ${
                mode === 'RECEIPT'
                  ? 'bg-emerald-400 text-slate-950 hover:bg-emerald-300'
                  : mode === 'ISSUE'
                  ? 'bg-rose-500 text-slate-950 hover:bg-rose-400'
                  : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
              }`}
            >
              {currentLang === 'am' ? 'እንቅስቃሴውን መዝግብ' : `Confirm ${mode} Entry`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
