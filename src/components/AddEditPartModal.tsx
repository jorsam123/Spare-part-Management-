import React, { useState, useEffect } from 'react';
import { X, Truck, DollarSign } from 'lucide-react';
import { Part, PartCategory, UnitOfMeasure, CriticalityLevel, MachineryMake, VehicleType } from '../types/inventory';
import { Language, getTranslation, translateCategory, translateVehicleType } from '../utils/i18n';

interface AddEditPartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (part: Part) => void;
  initialPart?: Part | null;
  currentLang?: Language;
}

const CATEGORIES: PartCategory[] = [
  'Undercarriage & Tracks',
  'Hydraulics & Cylinders',
  'Engine & Fuel Injection',
  'Transmission & Final Drive',
  'Ground Engaging Tools (GET)',
  'Filters & Service Maintenance',
  'Braking, Axles & Steering',
  'Heavy Electrical, Starters & Sensors',
  'Cabin, Glass & Structural',
];

const MAKES: MachineryMake[] = [
  'Caterpillar',
  'Komatsu',
  'Volvo CE',
  'Hitachi',
  'Liebherr',
  'John Deere',
  'Hyundai',
  'Universal Heavy Equipment',
];

const VEHICLE_TYPES: VehicleType[] = [
  'Hydraulic Excavator',
  'Bulldozer / Crawler',
  'Wheel Loader',
  'Articulated Haul Truck',
  'Motor Grader',
  'Mining Dump Truck',
];

export const AddEditPartModal: React.FC<AddEditPartModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialPart,
  currentLang = 'am',
}) => {
  const t = getTranslation(currentLang);

  const [formData, setFormData] = useState<Partial<Part>>({
    partNumber: '',
    oemPartNumber: '',
    brand: 'Caterpillar Genuine',
    name: '',
    description: '',
    category: 'Filters & Service Maintenance',
    unitOfMeasure: 'ea',
    location: {
      warehouse: currentLang === 'am' ? 'ዋና መጋዘን' : 'Heavy Store Main',
      aisle: 'FL-01',
      rack: 'R01',
      shelf: 'S01',
      bin: 'B01',
    },
    stockQuantity: 10,
    reservedQuantity: 0,
    minStockLevel: 5,
    reorderPoint: 8,
    maxStockLevel: 30,
    unitCost: 50.0,
    sellingPrice: 95.0,
    wholesalePrice: 78.0,
    weightKg: 5.0,
    compatibleVehicles: [
      { make: 'Caterpillar', model: '336D', vehicleType: 'Hydraulic Excavator', engineModel: 'Cat C9' },
    ],
    criticality: 'Medium',
    supplier: {
      name: 'Cat OEM Master Distributor',
      code: 'SUP-CAT-01',
      leadTimeDays: 3,
      contactEmail: 'orders@catdistrib.example.com',
      supplierPartNumber: '',
    },
    notes: '',
  });

  const [vehicleMake, setVehicleMake] = useState<MachineryMake>('Caterpillar');
  const [vehicleModel, setVehicleModel] = useState('336D');
  const [vehicleType, setVehicleType] = useState<VehicleType>('Hydraulic Excavator');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialPart) {
      setFormData(initialPart);
      if (initialPart.compatibleVehicles[0]) {
        setVehicleMake(initialPart.compatibleVehicles[0].make as MachineryMake);
        setVehicleModel(initialPart.compatibleVehicles[0].model);
        setVehicleType(initialPart.compatibleVehicles[0].vehicleType as VehicleType);
      }
    } else {
      setFormData({
        partNumber: '',
        oemPartNumber: '',
        brand: 'Caterpillar Genuine',
        name: '',
        description: '',
        category: 'Filters & Service Maintenance',
        unitOfMeasure: 'ea',
        location: {
          warehouse: currentLang === 'am' ? 'ዋና መጋዘን' : 'Heavy Store Main',
          aisle: 'FL-01',
          rack: 'R01',
          shelf: 'S01',
          bin: 'B01',
        },
        stockQuantity: 10,
        reservedQuantity: 0,
        minStockLevel: 5,
        reorderPoint: 8,
        maxStockLevel: 30,
        unitCost: 50.0,
        sellingPrice: 95.0,
        wholesalePrice: 78.0,
        weightKg: 5.0,
        compatibleVehicles: [
          { make: 'Caterpillar', model: '336D', vehicleType: 'Hydraulic Excavator', engineModel: 'Cat C9' },
        ],
        criticality: 'Medium',
        supplier: {
          name: 'Cat OEM Master Distributor',
          code: 'SUP-CAT-01',
          leadTimeDays: 3,
          contactEmail: 'orders@catdistrib.example.com',
          supplierPartNumber: '',
        },
        notes: '',
      });
      setVehicleMake('Caterpillar');
      setVehicleModel('336D');
      setVehicleType('Hydraulic Excavator');
    }
    setErrors({});
  }, [initialPart, isOpen, currentLang]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.partNumber?.trim()) {
      errs.partNumber = currentLang === 'am' ? 'የዕቃ ቁጥር ማስገባት ግዴታ ነው' : 'Part number is required';
    }
    if (!formData.name?.trim()) {
      errs.name = currentLang === 'am' ? 'የዕቃው ስም ማስገባት ግዴታ ነው' : 'Part name is required';
    }
    if (formData.unitCost === undefined || formData.unitCost < 0) {
      errs.unitCost = currentLang === 'am' ? 'ትክክለኛ የመግዣ ዋጋ ያስገቡ' : 'Valid unit cost required';
    }
    if (formData.sellingPrice === undefined || formData.sellingPrice < 0) {
      errs.sellingPrice = currentLang === 'am' ? 'ትክክለኛ የችርቻሮ መሸጫ ዋጋ ያስገቡ' : 'Valid retail selling price required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const now = new Date().toISOString();
    const cleanPart: Part = {
      id: initialPart?.id || `part-${Date.now()}`,
      partNumber: formData.partNumber!.trim().toUpperCase(),
      oemPartNumber: formData.oemPartNumber?.trim() || '',
      brand: formData.brand?.trim() || 'Genuine OEM',
      name: formData.name!.trim(),
      description: formData.description?.trim() || '',
      category: formData.category as PartCategory,
      unitOfMeasure: (formData.unitOfMeasure as UnitOfMeasure) || 'ea',
      location: {
        warehouse: formData.location?.warehouse || (currentLang === 'am' ? 'ዋና መጋዘን' : 'Heavy Store Main'),
        aisle: formData.location?.aisle || 'FL-01',
        rack: formData.location?.rack || 'R01',
        shelf: formData.location?.shelf || 'S01',
        bin: formData.location?.bin || 'B01',
      },
      stockQuantity: Number(formData.stockQuantity) || 0,
      reservedQuantity: Number(formData.reservedQuantity) || 0,
      minStockLevel: Number(formData.minStockLevel) || 2,
      reorderPoint: Number(formData.reorderPoint) || 4,
      maxStockLevel: Number(formData.maxStockLevel) || 20,
      unitCost: Number(formData.unitCost) || 0,
      sellingPrice: Number(formData.sellingPrice) || 0,
      wholesalePrice: Number(formData.wholesalePrice) || Number(formData.sellingPrice) * 0.8,
      weightKg: Number(formData.weightKg) || 1.0,
      compatibleVehicles: [
        {
          make: vehicleMake,
          model: vehicleModel.trim() || 'All Models',
          vehicleType: vehicleType,
        },
      ],
      criticality: (formData.criticality as CriticalityLevel) || 'Medium',
      supplier: {
        name: formData.supplier?.name?.trim() || 'OEM Heavy Equipment Supplies',
        code: formData.supplier?.code?.trim() || 'SUP-OEM',
        leadTimeDays: Number(formData.supplier?.leadTimeDays) || 5,
        contactEmail: formData.supplier?.contactEmail?.trim() || 'orders@oemheavy.example.com',
        supplierPartNumber: formData.supplier?.supplierPartNumber?.trim() || '',
      },
      lastRestockedAt: initialPart?.lastRestockedAt || now,
      updatedAt: now,
      notes: formData.notes?.trim() || '',
      barcode: formData.partNumber!.replace(/[^A-Za-z0-9]/g, '').toUpperCase(),
    };

    onSave(cleanPart);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <h3 className="text-sm font-semibold text-white">
              {initialPart ? t.editPartTitle : t.addNewPartTitle}
            </h3>
            <p className="text-xs text-slate-400">
              {t.addPartSub}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 overflow-y-auto space-y-4 text-xs">
          {/* Identification Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                {t.fieldPartNumber} <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.partNumber || ''}
                onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
                placeholder="e.g. 1R-0716, 708-2L-00300"
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded font-mono text-white focus:outline-none focus:border-amber-400"
              />
              {errors.partNumber && (
                <p className="text-[11px] text-rose-400 mt-1">{errors.partNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">{t.fieldOEM}</label>
              <input
                type="text"
                value={formData.oemPartNumber || ''}
                onChange={(e) => setFormData({ ...formData, oemPartNumber: e.target.value })}
                placeholder="e.g. CAT 1R0716 / P551315"
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded font-mono text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">{t.fieldBrand}</label>
              <input
                type="text"
                value={formData.brand || ''}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g. Caterpillar Genuine, Berco"
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              {t.fieldName} <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. High Efficiency Secondary Fuel Filter (2 Micron)"
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-white focus:outline-none focus:border-amber-400"
            />
            {errors.name && <p className="text-[11px] text-rose-400 mt-1">{errors.name}</p>}
          </div>

          {/* Machinery Vehicle Compatibility */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded space-y-2">
            <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.fitsMachineryVehicles}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">{t.filterMake}</label>
                <select
                  value={vehicleMake}
                  onChange={(e) => setVehicleMake(e.target.value as MachineryMake)}
                  className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                >
                  {MAKES.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">{currentLang === 'am' ? 'ሞዴል / ሲሪየስ' : 'Model / Series'}</label>
                <input
                  type="text"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  placeholder="e.g. 336D, PC200-8, D6T"
                  className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">{currentLang === 'am' ? 'የማሽኑ ዓይነት' : 'Vehicle Type'}</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                  className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                >
                  {VEHICLE_TYPES.map((vt) => (
                    <option key={vt} value={vt}>
                      {translateVehicleType(vt, currentLang)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded space-y-2">
            <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentLang === 'am' ? 'ዋጋ እና ክብደት' : 'Pricing & Weight'}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
              <div>
                <label className="block text-[10px] text-slate-400 font-sans mb-0.5">
                  {t.fieldUnitCost} <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.unitCost ?? 0}
                  onChange={(e) =>
                    setFormData({ ...formData, unitCost: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-sans mb-0.5">
                  {t.fieldWholesalePrice}
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.wholesalePrice ?? 0}
                  onChange={(e) =>
                    setFormData({ ...formData, wholesalePrice: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded text-amber-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-sans mb-0.5">
                  {t.fieldSellingPrice} <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.sellingPrice ?? 0}
                  onChange={(e) =>
                    setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded text-emerald-400 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-sans mb-0.5">
                  {t.fieldWeight}
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.weightKg ?? 1}
                  onChange={(e) =>
                    setFormData({ ...formData, weightKg: parseFloat(e.target.value) || 1 })
                  }
                  className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded text-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Category & Thresholds */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">{t.fieldCategory}</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as PartCategory })
                }
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-amber-400 text-xs"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {translateCategory(c, currentLang)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">{t.fieldInitialStock}</label>
              <input
                type="number"
                min="0"
                value={formData.stockQuantity ?? 0}
                onChange={(e) =>
                  setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded font-mono text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">{t.fieldROP}</label>
              <input
                type="number"
                min="1"
                value={formData.reorderPoint ?? 4}
                onChange={(e) =>
                  setFormData({ ...formData, reorderPoint: parseInt(e.target.value) || 4 })
                }
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded font-mono text-white text-xs"
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
            <div>
              <label className="block text-[10px] text-slate-400 font-sans mb-0.5">{t.fieldWarehouse}</label>
              <input
                type="text"
                value={formData.location?.warehouse || (currentLang === 'am' ? 'ዋና መጋዘን' : 'Heavy Store Main')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location!, warehouse: e.target.value },
                  })
                }
                className="w-full px-2 py-1 bg-slate-950 border border-slate-800 rounded text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 font-sans mb-0.5">{t.fieldAisle}</label>
              <input
                type="text"
                value={formData.location?.aisle || 'FL-01'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location!, aisle: e.target.value },
                  })
                }
                className="w-full px-2 py-1 bg-slate-950 border border-slate-800 rounded text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 font-sans mb-0.5">{t.fieldRack}</label>
              <input
                type="text"
                value={formData.location?.rack || 'R01'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location!, rack: e.target.value },
                  })
                }
                className="w-full px-2 py-1 bg-slate-950 border border-slate-800 rounded text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 font-sans mb-0.5">{t.fieldBin}</label>
              <input
                type="text"
                value={formData.location?.bin || 'B01'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location!, bin: e.target.value },
                  })
                }
                className="w-full px-2 py-1 bg-slate-950 border border-slate-800 rounded text-white text-xs"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">{t.technicalDescription}</label>
            <textarea
              rows={2}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={currentLang === 'am' ? 'ዝርዝር የዕቃው ቴክኒካዊ መረጃ...' : 'Detailed specs, tolerances, materials...'}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-white text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors shadow-sm"
            >
              {initialPart ? t.btnUpdatePart : t.btnSavePart}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
