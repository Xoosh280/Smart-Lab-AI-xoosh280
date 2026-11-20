export const navigation = [
  { section: 'OVERVIEW', items: [{ id: 'dashboard', label: 'Dashboard', icon: '⌂' }] },
  { section: 'ASSET MANAGEMENT', items: [
    { id: 'laboratory', label: 'Laboratory equipment', icon: '⚗' },
    { id: 'hospital', label: 'Hospital equipment', icon: '✚' },
    { id: 'imaging', label: 'Medical imaging', icon: '▣' },
    { id: 'spares', label: 'Spare parts', icon: '◈' },
  ] },
  { section: 'SERVICE & COMPLIANCE', items: [
    { id: 'maintenance', label: 'Preventive maintenance', icon: '◷', badge: '3' },
    { id: 'calibration', label: 'Calibration', icon: '⊙' },
    { id: 'repairs', label: 'Repair history', icon: '⌁' },
  ] },
  { section: 'TOOLS', items: [
    { id: 'assistant', label: 'AI troubleshooting', icon: '✳' },
    { id: 'reports', label: 'Technical reports', icon: '▤' },
  ] },
];

export const initialData = {
  equipment: [
    { id: 'EQ-1042', name: 'Hematology Analyzer', category: 'Laboratory', manufacturer: 'Sysmex', model: 'XN-1000', location: 'Central Lab', status: 'Operational', lastService: '2025-11-02' },
    { id: 'EQ-1038', name: 'Chemistry Analyzer', category: 'Laboratory', manufacturer: 'Roche', model: 'cobas  c 311', location: 'Central Lab', status: 'Operational', lastService: '2025-10-28' },
    { id: 'EQ-1021', name: 'MRI Scanner 1.5T', category: 'Imaging', manufacturer: 'Siemens', model: 'MAGNETOM Sola', location: 'Imaging Wing', status: 'Service due', lastService: '2025-08-14' },
    { id: 'EQ-1016', name: 'Digital X-Ray', category: 'Imaging', manufacturer: 'GE Healthcare', model: 'Definium 656', location: 'Radiology 2', status: 'Operational', lastService: '2025-10-19' },
    { id: 'EQ-1009', name: 'Patient Monitor', category: 'Hospital', manufacturer: 'Philips', model: 'IntelliVue MX450', location: 'ICU — Bed 04', status: 'Under repair', lastService: '2025-11-16' },
    { id: 'EQ-1003', name: 'Autoclave', category: 'Hospital', manufacturer: 'Getinge', model: 'HS66', location: 'Sterilization', status: 'Operational', lastService: '2025-09-30' },
    { id: 'EQ-0988', name: 'Blood Gas Analyzer', category: 'Laboratory', manufacturer: 'Radiometer', model: 'ABL90 FLEX', location: 'Emergency Lab', status: 'Operational', lastService: '2025-11-08' },
    { id: 'EQ-0972', name: 'Ultrasound System', category: 'Imaging', manufacturer: 'Philips', model: 'EPIQ 5', location: 'Imaging Wing', status: 'Operational', lastService: '2025-10-02' },
  ],
  maintenance: [
    { id: 'PM-2408', equipment: 'MRI Scanner 1.5T', assetId: 'EQ-1021', type: 'Preventive maintenance', dueDate: '2025-11-22', assigned: 'A. Hassan', priority: 'High', status: 'Scheduled' },
    { id: 'PM-2407', equipment: 'Chemistry Analyzer', assetId: 'EQ-1038', type: 'Preventive maintenance', dueDate: '2025-11-23', assigned: 'M. Ali', priority: 'Normal', status: 'Scheduled' },
    { id: 'PM-2406', equipment: 'Autoclave', assetId: 'EQ-1003', type: 'Safety inspection', dueDate: '2025-11-25', assigned: 'S. Omar', priority: 'Normal', status: 'Scheduled' },
    { id: 'PM-2405', equipment: 'Patient Monitor', assetId: 'EQ-1009', type: 'Corrective follow-up', dueDate: '2025-11-26', assigned: 'A. Hassan', priority: 'High', status: 'In progress' },
  ],
  calibration: [
    { id: 'CAL-508', equipment: 'Hematology Analyzer', assetId: 'EQ-1042', dueDate: '2025-11-24', standard: 'CBC reference control', result: 'Passed', technician: 'M. Ali' },
    { id: 'CAL-507', equipment: 'Digital X-Ray', assetId: 'EQ-1016', dueDate: '2025-11-27', standard: 'Dose meter QA', result: 'Due', technician: 'S. Omar' },
    { id: 'CAL-506', equipment: 'Blood Gas Analyzer', assetId: 'EQ-0988', dueDate: '2025-12-01', standard: 'Certified gas standard', result: 'Passed', technician: 'M. Ali' },
  ],
  repairs: [
    { id: 'WO-8821', equipment: 'Patient Monitor', assetId: 'EQ-1009', issue: 'Intermittent SpO₂ readings', opened: '2025-11-16', technician: 'A. Hassan', status: 'In progress', parts: 'SpO₂ sensor cable' },
    { id: 'WO-8817', equipment: 'Ultrasound System', assetId: 'EQ-0972', issue: 'Probe connector inspection', opened: '2025-11-12', technician: 'S. Omar', status: 'Completed', parts: 'None' },
    { id: 'WO-8809', equipment: 'Autoclave', assetId: 'EQ-1003', issue: 'Door seal replacement', opened: '2025-11-08', technician: 'M. Ali', status: 'Completed', parts: 'Door gasket' },
  ],
  spares: [
    { id: 'SP-2201', name: 'SpO₂ sensor cable', category: 'Patient monitoring', stock: 3, minimum: 2, location: 'Store A · Shelf 03', unit: 'pcs' },
    { id: 'SP-2194', name: 'Analyzer reagent probe', category: 'Laboratory', stock: 1, minimum: 2, location: 'Store B · Shelf 01', unit: 'pcs' },
    { id: 'SP-2180', name: 'Autoclave door gasket', category: 'Sterilization', stock: 6, minimum: 2, location: 'Store A · Shelf 08', unit: 'pcs' },
    { id: 'SP-2156', name: 'X-ray detector cable', category: 'Imaging', stock: 2, minimum: 1, location: 'Store C · Shelf 02', unit: 'pcs' },
  ],
};

export const pageMeta = {
  laboratory: { title: 'Laboratory equipment', description: 'Manage diagnostic and laboratory assets across your facility.', category: 'Laboratory' },
  hospital: { title: 'Hospital equipment', description: 'Track medical equipment supporting patient care and hospital operations.', category: 'Hospital' },
  imaging: { title: 'Medical imaging', description: 'Monitor imaging systems, service status, and asset locations.', category: 'Imaging' },
  maintenance: { title: 'Preventive maintenance', description: 'Plan and track scheduled equipment servicing and inspections.', dataKey: 'maintenance' },
  calibration: { title: 'Calibration management', description: 'Maintain calibration schedules and traceable test records.', dataKey: 'calibration' },
  repairs: { title: 'Repair history', description: 'Review corrective maintenance work orders and repair outcomes.', dataKey: 'repairs' },
  spares: { title: 'Spare parts inventory', description: 'Keep critical parts visible and monitor stock thresholds.', dataKey: 'spares' },
};
