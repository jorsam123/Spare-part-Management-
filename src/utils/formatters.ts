import { Part, StorageLocation } from '../types/inventory';

export function formatCurrency(amount: number, currencySymbol: string = 'ብር'): string {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${currencySymbol} ${formatted}`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatDate(isoString: string): string {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(d);
  } catch {
    return isoString;
  }
}

export function formatDateTime(isoString: string): string {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(d);
  } catch {
    return isoString;
  }
}

export function formatLocation(loc: StorageLocation, lang: 'am' | 'en' = 'am'): string {
  if (!loc) return lang === 'am' ? 'ያልተመደበ' : 'Unassigned';
  const whName = lang === 'am'
    ? (loc.warehouse === 'Heavy Store Main' ? 'ዋና መጋዘን' : loc.warehouse === 'Yard Bay Undercarriage' ? 'ያርድ' : loc.warehouse)
    : loc.warehouse;
  return `${whName} · ${loc.aisle}-${loc.rack}-${loc.bin}`;
}

export function formatLocationFull(loc: StorageLocation, lang: 'am' | 'en' = 'am'): string {
  if (!loc) return lang === 'am' ? 'ያልተመደበ' : 'Unassigned';
  const whName = lang === 'am'
    ? (loc.warehouse === 'Heavy Store Main' ? 'ዋና መጋዘን' : loc.warehouse === 'Yard Bay Undercarriage' ? 'የስር ሰረገላ ያርድ' : loc.warehouse)
    : loc.warehouse;
  if (lang === 'am') {
    return `${whName} / ረድፍ ${loc.aisle} / መደርደሪያ ${loc.rack} / ደረጃ ${loc.shelf} / ቢን ${loc.bin}`;
  }
  return `${whName} / Aisle ${loc.aisle} / Rack ${loc.rack} / Shelf ${loc.shelf} / Bin ${loc.bin}`;
}

export type StockHealthStatus = 'Critical' | 'Low' | 'Nominal' | 'Overstocked';

export function getStockStatus(part: Part, lang: 'am' | 'en' = 'am'): {
  status: StockHealthStatus;
  label: string;
  colorClass: string;
  badgeClass: string;
} {
  const available = part.stockQuantity - part.reservedQuantity;

  if (part.stockQuantity < part.minStockLevel || available <= 0) {
    return {
      status: 'Critical',
      label: lang === 'am' ? 'አስቸኳይ እጥረት' : 'Critical Shortage',
      colorClass: 'text-rose-400',
      badgeClass: 'text-rose-400 bg-rose-950/60 border border-rose-800/60',
    };
  }

  if (part.stockQuantity <= part.reorderPoint) {
    return {
      status: 'Low',
      label: lang === 'am' ? 'ማዘዣ ደርሷል' : 'Needs Reorder',
      colorClass: 'text-amber-400',
      badgeClass: 'text-amber-400 bg-amber-950/60 border border-amber-800/60',
    };
  }

  if (part.stockQuantity > part.maxStockLevel) {
    return {
      status: 'Overstocked',
      label: lang === 'am' ? 'ከመጠን ያለፈ' : 'Overstocked',
      colorClass: 'text-indigo-400',
      badgeClass: 'text-indigo-400 bg-indigo-950/60 border border-indigo-800/60',
    };
  }

  return {
    status: 'Nominal',
    label: lang === 'am' ? 'በቂ ክምችት' : 'Adequate Stock',
    colorClass: 'text-emerald-400',
    badgeClass: 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/60',
  };
}
