import React, { useState, useMemo } from 'react';
import { Warehouse, MapPin, ArrowRight } from 'lucide-react';
import { Part } from '../types/inventory';
import { getStockStatus } from '../utils/formatters';
import { Language, getTranslation, translateWarehouse } from '../utils/i18n';

interface WarehouseBinMapViewProps {
  parts: Part[];
  onSelectPart: (part: Part) => void;
  onOpenQuickAction: (mode: 'RECEIPT' | 'ISSUE' | 'ADJUSTMENT', preselectedPartId?: string) => void;
  currentLang?: Language;
}

export const WarehouseBinMapView: React.FC<WarehouseBinMapViewProps> = ({
  parts,
  onSelectPart,
  onOpenQuickAction,
  currentLang = 'am',
}) => {
  const t = getTranslation(currentLang);

  const warehouses = useMemo(() => {
    const set = new Set<string>();
    parts.forEach((p) => {
      if (p.location?.warehouse) set.add(p.location.warehouse);
    });
    return Array.from(set).sort();
  }, [parts]);

  const [selectedWarehouse, setSelectedWarehouse] = useState<string>(
    warehouses[0] || 'Heavy Store Main'
  );

  const warehouseParts = useMemo(() => {
    return parts.filter((p) => p.location?.warehouse === selectedWarehouse);
  }, [parts, selectedWarehouse]);

  const aisles = useMemo(() => {
    const aisleMap = new Map<string, Part[]>();
    warehouseParts.forEach((p) => {
      const aisle = p.location?.aisle || 'General';
      const list = aisleMap.get(aisle) || [];
      list.push(p);
      aisleMap.set(aisle, list);
    });
    return Array.from(aisleMap.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [warehouseParts]);

  const [selectedAisle, setSelectedAisle] = useState<string>(aisles[0]?.[0] || 'FL-01');

  React.useEffect(() => {
    if (aisles.length > 0 && !aisles.some(([a]) => a === selectedAisle)) {
      setSelectedAisle(aisles[0][0]);
    }
  }, [aisles, selectedAisle]);

  const activeAisleParts = useMemo(() => {
    return warehouseParts.filter((p) => (p.location?.aisle || 'General') === selectedAisle);
  }, [warehouseParts, selectedAisle]);

  return (
    <div className="space-y-4">
      {/* Top Controls */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-white">{t.yardMapTitle}</h2>
          <p className="text-xs text-slate-400">
            {t.yardMapSub}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">{t.facility}</span>
          <div className="flex items-center gap-1 p-0.5 bg-slate-950 border border-slate-800 rounded text-xs">
            {warehouses.map((wh) => (
              <button
                key={wh}
                onClick={() => setSelectedWarehouse(wh)}
                className={`px-3 py-1 rounded font-medium transition-colors ${
                  selectedWarehouse === wh
                    ? 'bg-slate-800 text-amber-400 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {translateWarehouse(wh, currentLang)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Aisle Tabs */}
      <div className="flex items-center gap-2 p-2 bg-slate-900/40 border border-slate-800 rounded overflow-x-auto text-xs">
        <span className="text-[11px] text-slate-400 uppercase tracking-wider px-2">{t.aisles}</span>
        {aisles.map(([aisle, pList]) => (
          <button
            key={aisle}
            onClick={() => setSelectedAisle(aisle)}
            className={`px-3 py-1.5 rounded font-mono font-medium transition-colors whitespace-nowrap ${
              selectedAisle === aisle
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {t.aisle} {aisle} ({pList.length} {currentLang === 'am' ? 'ዕቃዎች' : 'parts'})
          </button>
        ))}
      </div>

      {/* Storage Bays Grid */}
      <div className="p-5 bg-slate-900/60 border border-slate-800 rounded">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Warehouse className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-semibold text-white">
              {translateWarehouse(selectedWarehouse, currentLang)} — {t.aisle} {selectedAisle}
            </h3>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/20 border border-emerald-500/60 inline-block" />
              <span>{t.statusNominal}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500/20 border border-rose-500/60 inline-block" />
              <span>{t.statusCritical}</span>
            </div>
          </div>
        </div>

        {activeAisleParts.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            {currentLang === 'am' ? 'በዚህ ረድፍ ውስጥ ምንም ዕቃ አልተመደበም።' : 'No parts assigned to this aisle.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeAisleParts.map((part) => {
              const { status, label, colorClass } = getStockStatus(part, currentLang);
              const isCritical = status === 'Critical';

              return (
                <div
                  key={part.id}
                  className={`p-3.5 rounded border transition-colors ${
                    isCritical
                      ? 'bg-rose-950/20 border-rose-800/60 hover:border-rose-600'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
                    <div className="flex items-center gap-1.5 font-mono text-xs text-amber-400 font-bold">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>
                        {t.rack} {part.location.rack} · {t.shelf} {part.location.shelf} · {t.bin} {part.location.bin}
                      </span>
                    </div>
                    <span className={`text-[10px] font-semibold ${colorClass}`}>
                      {label}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectPart(part)}
                    className="text-left w-full group mb-2"
                  >
                    <p className="font-mono text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                      {part.partNumber}
                    </p>
                    <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">{part.name}</p>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{part.brand}</p>
                  </button>

                  <div className="py-2 px-2.5 bg-slate-900/90 rounded border border-slate-800/80 text-xs font-mono flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">{t.stockOnHand}</span>
                      <span className={`font-bold tabular-nums ${colorClass}`}>
                        {part.stockQuantity} {part.unitOfMeasure}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-sans">{t.safetyMin}</span>
                      <span className="text-slate-400 tabular-nums">
                        {part.minStockLevel} {part.unitOfMeasure}
                      </span>
                    </div>
                  </div>

                  {part.compatibleVehicles.length > 0 && (
                    <div className="mt-2 text-[10px] text-slate-400 truncate">
                      <span className="text-slate-400">{currentLang === 'am' ? 'የሚገጥምላቸው:' : 'Fits Machinery:'} </span>
                      <span className="text-amber-300 font-mono">
                        {part.compatibleVehicles
                          .slice(0, 2)
                          .map((v) => `${v.make} ${v.model}`)
                          .join(', ')}
                        {part.compatibleVehicles.length > 2 && ' + ተጨማሪ'}
                      </span>
                    </div>
                  )}

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <button
                      onClick={() => onSelectPart(part)}
                      className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <span>{t.fullSpecs}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onOpenQuickAction('RECEIPT', part.id)}
                        className="px-2 py-0.5 text-[11px] text-emerald-400 hover:bg-emerald-950/40 rounded transition-colors"
                      >
                        {t.btnReceive}
                      </button>
                      <button
                        onClick={() => onOpenQuickAction('ISSUE', part.id)}
                        className="px-2 py-0.5 text-[11px] text-rose-400 hover:bg-rose-950/40 rounded transition-colors"
                      >
                        {t.btnIssue}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
