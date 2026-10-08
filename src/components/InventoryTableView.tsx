import React, { useState, useMemo } from 'react';
import {
  Search,
  Download,
  Plus,
  ArrowUpDown,
  Barcode,
  ShoppingCart,
  ArrowDownRight,
  Boxes,
  LayoutGrid,
  Table as TableIcon,
} from 'lucide-react';
import { Part } from '../types/inventory';
import {
  formatCurrency,
  formatNumber,
  formatLocation,
  getStockStatus,
} from '../utils/formatters';
import { Language, getTranslation, translateCategory, translateWarehouse } from '../utils/i18n';

interface InventoryTableViewProps {
  parts: Part[];
  onSelectPart: (part: Part) => void;
  onEditPart: (part: Part) => void;
  onDeletePart: (partId: string) => void;
  onOpenAddPart: () => void;
  onOpenQuickAction: (mode: 'RECEIPT' | 'ISSUE' | 'ADJUSTMENT', preselectedPartId?: string) => void;
  onSellPart: (part: Part) => void;
  onPrintLabel: (part: Part) => void;
  currentLang?: Language;
}

type SortField =
  | 'partNumber'
  | 'name'
  | 'stockQuantity'
  | 'available'
  | 'sellingPrice'
  | 'wholesalePrice'
  | 'totalValue';

export const InventoryTableView: React.FC<InventoryTableViewProps> = ({
  parts,
  onSelectPart,
  onEditPart,
  onDeletePart,
  onOpenAddPart,
  onOpenQuickAction,
  onSellPart,
  onPrintLabel,
  currentLang = 'am',
}) => {
  const t = getTranslation(currentLang);
  const currSymbol = t.currencySymbol;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMake, setSelectedMake] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [sortField, setSortField] = useState<SortField>('partNumber');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Available makes & categories
  const makes = useMemo(() => {
    const set = new Set<string>();
    parts.forEach((p) => {
      p.compatibleVehicles.forEach((v) => set.add(v.make));
    });
    return Array.from(set).sort();
  }, [parts]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    parts.forEach((p) => set.add(p.category));
    return Array.from(set).sort();
  }, [parts]);

  // Filtering
  const filteredParts = useMemo(() => {
    return parts.filter((part) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNum = part.partNumber.toLowerCase().includes(q);
        const matchOem = part.oemPartNumber.toLowerCase().includes(q);
        const matchName = part.name.toLowerCase().includes(q);
        const matchBrand = part.brand.toLowerCase().includes(q);
        const matchBin = `${part.location.warehouse} ${part.location.aisle} ${part.location.bin}`
          .toLowerCase()
          .includes(q);
        const matchVehicle = part.compatibleVehicles.some((v) =>
          `${v.make} ${v.model} ${v.vehicleType} ${v.engineModel || ''}`.toLowerCase().includes(q)
        );

        if (!matchNum && !matchOem && !matchName && !matchBrand && !matchBin && !matchVehicle) {
          return false;
        }
      }

      if (selectedMake !== 'ALL') {
        const hasMake = part.compatibleVehicles.some((v) => v.make === selectedMake);
        if (!hasMake) return false;
      }

      if (selectedCategory !== 'ALL' && part.category !== selectedCategory) {
        return false;
      }

      if (selectedStatus !== 'ALL') {
        const { status } = getStockStatus(part, currentLang);
        if (status !== selectedStatus) return false;
      }

      return true;
    });
  }, [parts, searchQuery, selectedMake, selectedCategory, selectedStatus, currentLang]);

  // Sorting
  const sortedParts = useMemo(() => {
    return [...filteredParts].sort((a, b) => {
      let valA: any = a[sortField as keyof Part];
      let valB: any = b[sortField as keyof Part];

      if (sortField === 'available') {
        valA = a.stockQuantity - a.reservedQuantity;
        valB = b.stockQuantity - b.reservedQuantity;
      } else if (sortField === 'totalValue') {
        valA = a.stockQuantity * a.sellingPrice;
        valB = b.stockQuantity * b.sellingPrice;
      }

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = (valB as string).toLowerCase();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredParts, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Part Number',
      'OEM Part Number',
      'Brand',
      'Name',
      'Category',
      'Compatible Vehicles',
      'In Stock',
      'Available',
      'Unit Cost (ETB)',
      'Wholesale Price (ETB)',
      'Retail Price (ETB)',
      'Weight (kg)',
      'Location',
      'Supplier',
    ];

    const rows = sortedParts.map((p) => [
      `"${p.partNumber}"`,
      `"${p.oemPartNumber}"`,
      `"${p.brand}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      `"${p.compatibleVehicles.map((v) => `${v.make} ${v.model}`).join('; ')}"`,
      p.stockQuantity,
      p.stockQuantity - p.reservedQuantity,
      p.unitCost.toFixed(2),
      p.wholesalePrice.toFixed(2),
      p.sellingPrice.toFixed(2),
      p.weightKg,
      `"${p.location.warehouse} / ${p.location.aisle}-${p.location.bin}"`,
      `"${p.supplier.name}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `heavyequip_catalog_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Top Filter & Action Bar */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                {currentLang === 'am' ? 'አጥፋ' : 'Clear'}
              </button>
            )}
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-0.5 bg-slate-950 border border-slate-800 rounded">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'table' ? 'bg-slate-800 text-amber-400' : 'text-slate-400 hover:text-white'
                }`}
                title="የሰንጠረዥ እይታ"
              >
                <TableIcon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'cards' ? 'bg-slate-800 text-amber-400' : 'text-slate-400 hover:text-white'
                }`}
                title="የካርድ እይታ"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.btnExportCSV}</span>
            </button>

            <button
              onClick={onOpenAddPart}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.btnNewPart}</span>
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-xs">
          {/* Machinery Make Filter */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">{t.filterMake}</label>
            <select
              value={selectedMake}
              onChange={(e) => setSelectedMake(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-amber-400 text-xs"
            >
              <option value="ALL">{t.allMakes}</option>
              {makes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* System Category */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">{t.filterCategory}</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-amber-400 text-xs"
            >
              <option value="ALL">{t.allCategories}</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {translateCategory(c, currentLang)}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Health */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">{t.filterStockStatus}</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-amber-400 text-xs"
            >
              <option value="ALL">{t.allStockLevels}</option>
              <option value="Critical">{t.statusCritical}</option>
              <option value="Low">{t.statusLow}</option>
              <option value="Nominal">{t.statusNominal}</option>
              <option value="Overstocked">{t.statusOverstocked}</option>
            </select>
          </div>
        </div>

        {/* Count & Value Summary */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <div className="flex items-center gap-2">
            <span>
              {t.showingCatalog} <strong className="text-white tabular-nums">{sortedParts.length}</strong> {t.ofCatalog}{' '}
              <strong className="text-slate-300 tabular-nums">{parts.length}</strong> {t.machinerySpareParts}
            </span>
            {(selectedMake !== 'ALL' || selectedCategory !== 'ALL' || selectedStatus !== 'ALL' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedMake('ALL');
                  setSelectedCategory('ALL');
                  setSelectedStatus('ALL');
                  setSearchQuery('');
                }}
                className="text-amber-400 hover:underline"
              >
                {t.resetFilters}
              </button>
            )}
          </div>

          <div className="hidden sm:block">
            <span>{t.catalogRetailValue}: </span>
            <span className="font-mono text-emerald-400 font-semibold tabular-nums">
              {formatCurrency(
                sortedParts.reduce((acc, p) => acc + p.stockQuantity * p.sellingPrice, 0),
                currSymbol
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Main View */}
      {sortedParts.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/40 border border-slate-800 rounded">
          <Boxes className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">
            {currentLang === 'am' ? 'የተፈለገው መለዋወጫ አልተገኘም' : 'No machinery parts match your filters'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {currentLang === 'am'
              ? 'የፍለጋ ቃሉን ወይም የማጣሪያ ምርጫውን ይለውጡ ወይም አዲስ መለዋወጫ ይመዝግቡ።'
              : 'Try adjusting your search query, selecting another machinery brand, or register a new part SKU.'}
          </p>
          <button
            onClick={onOpenAddPart}
            className="mt-4 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors"
          >
            {t.btnNewPart}
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 select-none">
                  <th
                    onClick={() => handleSort('partNumber')}
                    className="py-3 px-4 font-medium cursor-pointer hover:text-white"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{t.colPartNumber}</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('name')}
                    className="py-3 px-4 font-medium cursor-pointer hover:text-white"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{t.colDescription}</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-4 font-medium">{t.colCompatibleVehicles}</th>
                  <th className="py-3 px-4 font-medium">{t.colLocation}</th>
                  <th
                    onClick={() => handleSort('stockQuantity')}
                    className="py-3 px-3 font-medium text-right cursor-pointer hover:text-white"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>{t.colInStock}</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('wholesalePrice')}
                    className="py-3 px-3 font-medium text-right cursor-pointer hover:text-white"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>{t.colWholesale}</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('sellingPrice')}
                    className="py-3 px-3 font-medium text-right cursor-pointer hover:text-white"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>{t.colRetail}</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-4 font-medium text-right">{t.colCounterActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {sortedParts.map((part) => {
                  const { status, label, colorClass } = getStockStatus(part, currentLang);

                  return (
                    <tr key={part.id} className="hover:bg-slate-800/40 transition-colors group">
                      {/* Part Number & Brand */}
                      <td className="py-2.5 px-4">
                        <button
                          onClick={() => onSelectPart(part)}
                          className="text-left group-hover:text-amber-400 transition-colors"
                        >
                          <span className="font-mono font-bold text-white block">
                            {part.partNumber}
                          </span>
                          <span className="text-[10px] text-slate-400 block truncate max-w-[150px]">
                            {part.brand}
                          </span>
                        </button>
                      </td>

                      {/* Name & Category */}
                      <td className="py-2.5 px-4 max-w-[260px]">
                        <p className="font-medium text-slate-200 truncate">{part.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {translateCategory(part.category, currentLang)} · {part.weightKg} {currentLang === 'am' ? 'ኪ.ግ' : 'kg'}
                        </p>
                      </td>

                      {/* Compatible Vehicles */}
                      <td className="py-2.5 px-4 max-w-[220px]">
                        <div className="space-y-0.5">
                          {part.compatibleVehicles.slice(0, 2).map((v, i) => (
                            <span
                              key={i}
                              className="font-mono text-[11px] text-amber-300/90 block truncate"
                            >
                              {v.make} {v.model}
                            </span>
                          ))}
                          {part.compatibleVehicles.length > 2 && (
                            <span className="text-[10px] text-slate-500 block">
                              +{part.compatibleVehicles.length - 2} {currentLang === 'am' ? 'ተጨማሪ' : 'more'}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-2.5 px-4 font-mono text-[11px] text-slate-300 whitespace-nowrap">
                        <span className="text-slate-400">{translateWarehouse(part.location.warehouse, currentLang)}</span>
                        <span className="mx-1 text-slate-600">·</span>
                        <span>{part.location.aisle}-{part.location.bin}</span>
                      </td>

                      {/* Stock Level */}
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                        <span className={`font-bold ${colorClass}`}>
                          {part.stockQuantity}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-1">
                          {part.unitOfMeasure}
                        </span>
                        {part.reservedQuantity > 0 && (
                          <span className="text-[10px] text-amber-400/80 block">
                            ({part.reservedQuantity} {currentLang === 'am' ? 'የተያዘ' : 'res'})
                          </span>
                        )}
                      </td>

                      {/* Wholesale Trade Price */}
                      <td className="py-2.5 px-3 text-right font-mono text-slate-300 tabular-nums">
                        {formatCurrency(part.wholesalePrice, currSymbol)}
                      </td>

                      {/* Retail Price */}
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-emerald-400 tabular-nums">
                        {formatCurrency(part.sellingPrice, currSymbol)}
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSellPart(part)}
                            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors whitespace-nowrap shadow-sm"
                            title={t.btnSell}
                          >
                            <ShoppingCart className="w-3 h-3" />
                            <span>{t.btnSell}</span>
                          </button>

                          <button
                            onClick={() => onOpenQuickAction('RECEIPT', part.id)}
                            className="p-1 text-emerald-400 hover:bg-emerald-950/40 rounded transition-colors"
                            title={t.btnReceiveStock}
                          >
                            <ArrowDownRight className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onPrintLabel(part)}
                            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                            title={t.btnPrint}
                          >
                            <Barcode className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onEditPart(part)}
                            className="px-2 py-1 text-[11px] text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors"
                          >
                            {t.btnEdit}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sortedParts.map((part) => {
            const { status, label, colorClass } = getStockStatus(part, currentLang);

            return (
              <div
                key={part.id}
                className="p-4 bg-slate-900/60 border border-slate-800 rounded hover:border-slate-700 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <button
                        onClick={() => onSelectPart(part)}
                        className="font-mono text-base font-bold text-white hover:text-amber-400 transition-colors text-left"
                      >
                        {part.partNumber}
                      </button>
                      <span className="text-[10px] text-slate-400 block font-sans">
                        {part.brand} · OEM: {part.oemPartNumber}
                      </span>
                    </div>
                    <span className={`text-[11px] font-semibold ${colorClass}`}>
                      {label}
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-200 line-clamp-1">{part.name}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 mb-3">
                    {part.description}
                  </p>

                  {/* Vehicle Compatibility Tag list */}
                  <div className="p-2 bg-slate-950/80 border border-slate-800/80 rounded mb-3 text-[11px]">
                    <span className="text-slate-400 text-[10px] block mb-1">
                      {currentLang === 'am' ? 'የሚገጥምላቸው ማሽኖች:' : 'Fits Machinery:'}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {part.compatibleVehicles.map((v, i) => (
                        <span
                          key={i}
                          className="font-mono text-[10px] text-amber-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800"
                        >
                          {v.make} {v.model}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pricing and Stock Grid */}
                  <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-slate-950/60 border border-slate-800/80 rounded font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">{t.inStock}</span>
                      <span className={`font-bold tabular-nums ${colorClass}`}>
                        {part.stockQuantity} {part.unitOfMeasure}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">{t.colWholesale}</span>
                      <span className="text-slate-200 tabular-nums">
                        {formatCurrency(part.wholesalePrice, currSymbol)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">{t.colRetail}</span>
                      <span className="text-emerald-400 font-bold tabular-nums">
                        {formatCurrency(part.sellingPrice, currSymbol)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="font-mono text-[11px] text-slate-400">
                    {formatLocation(part.location, currentLang)}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSellPart(part)}
                      className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors shadow-sm"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>{t.btnSell}</span>
                    </button>
                    <button
                      onClick={() => onEditPart(part)}
                      className="px-2 py-1 text-[11px] text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors"
                    >
                      {t.btnEdit}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
