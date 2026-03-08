// Chemical Database for Atom Economy
export const chemicalDatabase = [
  { formula: 'C3H6O', name: 'Acrolein', mw: 56.06, type: 'Aldehyde' },
  { formula: 'C2H4O', name: 'Acetaldehyde', mw: 44.05, type: 'Aldehyde' },
  { formula: 'C3H6O2', name: 'Methyl Acetate', mw: 74.08, type: 'Ester' },
  { formula: 'C4H8O2', name: 'Ethyl Acetate', mw: 88.10, type: 'Ester' },
  { formula: 'C6H12O6', name: 'Glucose', mw: 180.16, type: 'Carbohydrate' },
  { formula: 'C12H22O11', name: 'Sucrose', mw: 342.30, type: 'Carbohydrate' },
  { formula: 'C2H4', name: 'Ethylene', mw: 28.05, type: 'Alkene' },
  { formula: 'C3H6', name: 'Propylene', mw: 42.08, type: 'Alkene' },
  { formula: 'C6H6', name: 'Benzene', mw: 78.11, type: 'Aromatic' },
  { formula: 'C7H8', name: 'Toluene', mw: 92.14, type: 'Aromatic' },
  { formula: 'C8H10', name: 'Xylene', mw: 106.16, type: 'Aromatic' },
  { formula: 'CH4', name: 'Methane', mw: 16.04, type: 'Alkane' },
  { formula: 'C2H6', name: 'Ethane', mw: 30.07, type: 'Alkane' },
  { formula: 'C3H8', name: 'Propane', mw: 44.10, type: 'Alkane' },
  { formula: 'C4H10', name: 'Butane', mw: 58.12, type: 'Alkane' },
  { formula: 'H2O', name: 'Water', mw: 18.02, type: 'Solvent' },
  { formula: 'C2H5OH', name: 'Ethanol', mw: 46.07, type: 'Alcohol' },
  { formula: 'CH3OH', name: 'Methanol', mw: 32.04, type: 'Alcohol' },
  { formula: 'C3H8O', name: 'Isopropanol', mw: 60.10, type: 'Alcohol' },
  { formula: 'NH3', name: 'Ammonia', mw: 17.03, type: 'Base' },
  { formula: 'HCl', name: 'Hydrochloric Acid', mw: 36.46, type: 'Acid' },
  { formula: 'H2SO4', name: 'Sulfuric Acid', mw: 98.08, type: 'Acid' },
  { formula: 'HNO3', name: 'Nitric Acid', mw: 63.01, type: 'Acid' },
  { formula: 'NaOH', name: 'Sodium Hydroxide', mw: 40.00, type: 'Base' },
  { formula: 'KOH', name: 'Potassium Hydroxide', mw: 56.11, type: 'Base' },
];

export const additionalCaseStudies = [
  { name: 'BDS Process', company: 'BASF', improvement: '60% less waste', description: 'Switched to catalytic hydrogenation for vitamin production' },
  { name: 'Tetracycline', company: 'Pfizer', improvement: 'Reduced steps from 11 to 5', description: 'Biocatalytic route eliminated multiple protection steps' },
  { name: 'Naproxen', company: 'Roche', improvement: 'Atom economy 77%', description: 'Catalytic route using asymmetric synthesis' },
  { name: 'Vitamin B6', company: 'Merck', improvement: '50% fewer steps', description: 'Flow chemistry enabled continuous production' },
  { name: 'Caprolactam', company: 'DSM', improvement: 'No ammonium sulfate waste', description: 'Enzymatic route eliminated salt by-product' }
];

export const greenMetrics = [
  { name: 'Atom Economy (AE)', target: '>60%', description: 'Mass of product / Mass of all reactants × 100' },
  { name: 'E-Factor', target: '<5', description: 'kg waste / kg product - lower is better' },
  { name: 'Reaction Mass Efficiency', target: '>70%', description: 'AE × Yield = effective mass utilization' },
  { name: 'Process Mass Intensity', target: '<25', description: 'Total input mass / product mass - lower is better' },
  { name: 'Carbon Efficiency', target: '>80%', description: 'Carbon in product / carbon in all inputs' },
  { name: 'Oxygen Efficiency', target: '>90%', description: 'Oxygen atoms used / total oxygen' },
  { name: 'Energy Intensity', target: '<50 kWh/kg', description: 'Energy per unit mass of product' },
  { name: 'Water Use', target: '<50 L/kg', description: 'Water consumption per kg product' },
  { name: 'Hazard Score', target: 'Minimize', description: 'Combined hazard of all reagents (0-1000)' },
  { name: 'Renewable Carbon', target: '>50%', description: 'Percentage from renewable sources' }
];
