import React from 'react';
import { X, Printer, Barcode } from 'lucide-react';
import { Part } from '../types/inventory';

interface PrintLabelModalProps {
  part: Part | null;
  onClose: () => void;
}

export const PrintLabelModal: React.FC<PrintLabelModalProps> = ({ part, onClose }) => {
  if (!part) return null;

  const handlePrint = () => {
    window.print();
  };

  const generateBarcodeBars = (code: string) => {
    const bars: number[] = [];
    for (let i = 0; i < code.length; i++) {
      const charCode = code.charCodeAt(i);
      bars.push((charCode % 3) + 1);
      bars.push(((charCode >> 1) % 2) + 1);
      bars.push(((charCode >> 2) % 3) + 1);
    }
    return bars.slice(0, 36);
  };

  const barcodeBars = generateBarcodeBars(part.partNumber);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50 print:hidden">
          <div className="flex items-center gap-2">
            <Barcode className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Machinery Bin Tag Preview</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Label Area */}
        <div className="p-6 bg-slate-950 flex flex-col items-center">
          <div
            id="printable-label-card"
            className="w-full max-w-sm bg-white text-black p-5 rounded-none border-2 border-black font-sans shadow-lg select-text"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-black pb-1.5 mb-2">
              <span className="font-extrabold text-xs uppercase tracking-wider">
                HEAVYEQUIP · {part.location.warehouse}
              </span>
              <span className="font-mono text-[10px] font-bold">
                {part.weightKg} KG
              </span>
            </div>

            {/* Part Number Hero */}
            <div className="mb-2">
              <p className="font-mono text-2xl font-black tracking-tight leading-none">
                {part.partNumber}
              </p>
              <p className="text-[11px] font-bold text-neutral-800 mt-1">
                {part.brand} {part.oemPartNumber && `· OEM: ${part.oemPartNumber}`}
              </p>
              <p className="text-xs font-semibold leading-tight text-neutral-900 mt-1 line-clamp-2">
                {part.name}
              </p>
            </div>

            {/* Compatible Heavy Vehicles */}
            <div className="p-1.5 bg-neutral-100 border border-neutral-300 rounded mb-2 font-mono text-[10px]">
              <span className="font-bold text-black uppercase block text-[9px] font-sans">
                Machinery Compatibility:
              </span>
              <span className="text-neutral-800">
                {part.compatibleVehicles.map((v) => `${v.make} ${v.model}`).join(' · ')}
              </span>
            </div>

            {/* Barcode Graphic */}
            <div className="my-1.5 py-1 bg-white flex flex-col items-center">
              <div className="flex items-stretch h-11 gap-[2px]">
                {barcodeBars.map((w, idx) => (
                  <div key={idx} className="bg-black" style={{ width: `${w * 2}px` }} />
                ))}
              </div>
              <span className="font-mono text-[11px] font-bold tracking-widest mt-1">
                *{part.barcode}*
              </span>
            </div>

            {/* Storage Location Grid */}
            <div className="border-t-2 border-b-2 border-black py-1.5 my-2 grid grid-cols-4 text-center font-mono">
              <div className="border-r border-black pr-1">
                <span className="text-[9px] uppercase font-bold block text-neutral-600 font-sans">
                  Aisle
                </span>
                <span className="text-base font-black">{part.location.aisle}</span>
              </div>
              <div className="border-r border-black px-1">
                <span className="text-[9px] uppercase font-bold block text-neutral-600 font-sans">
                  Rack
                </span>
                <span className="text-base font-black">{part.location.rack}</span>
              </div>
              <div className="border-r border-black px-1">
                <span className="text-[9px] uppercase font-bold block text-neutral-600 font-sans">
                  Shelf
                </span>
                <span className="text-base font-black">{part.location.shelf}</span>
              </div>
              <div className="pl-1">
                <span className="text-[9px] uppercase font-bold block text-neutral-600 font-sans">
                  Bin
                </span>
                <span className="text-base font-black">{part.location.bin}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-[10px] font-mono font-bold pt-1">
              <div>
                <span>MIN: {part.minStockLevel} · ROP: {part.reorderPoint}</span>
                <span className="block font-sans text-neutral-700 font-normal">
                  {part.category}
                </span>
              </div>
              <div className="text-right">
                <span className="block text-black">Retail: ${part.sellingPrice.toFixed(2)}</span>
                <span className="text-neutral-700">Fleet: ${part.wholesalePrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between print:hidden">
          <p className="text-[11px] text-slate-400">Thermal Bin Tag format (4"x3")</p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white rounded transition-colors"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Label</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
