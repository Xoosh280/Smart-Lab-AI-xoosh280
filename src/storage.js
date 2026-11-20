import { initialData } from './data.js';

const STORAGE_KEY = 'smart-lab-ai-data-v1';
const COLLECTIONS = Object.keys(initialData);

function storage() {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

function validRecord(collection, value) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || typeof value.id !== 'string' || !value.id.trim()) return false;
  const required = {
    equipment: ['name', 'category', 'status'],
    maintenance: ['equipment', 'type', 'dueDate', 'assigned', 'status'],
    calibration: ['equipment', 'dueDate', 'standard', 'result', 'technician'],
    repairs: ['equipment', 'issue', 'opened', 'technician', 'status'],
    spares: ['name', 'category', 'stock', 'minimum'],
  }[collection] || [];
  return required.every(key => value[key] !== undefined && value[key] !== null && String(value[key]).trim() !== '');
}

function defaults() {
  return Object.fromEntries(COLLECTIONS.map(key => [key, initialData[key].map(record => ({ ...record }))]));
}

function normalizeSavedData(saved, deletedIds) {
  const result = defaults();
  for (const key of COLLECTIONS) {
    if (!Array.isArray(saved?.[key])) continue;
    const valid = saved[key].filter(record => validRecord(key, record));
    const byId = new Map(result[key].map(record => [record.id, record]));
    for (const record of valid) byId.set(record.id, { ...byId.get(record.id), ...record });
    const deleted = new Set(deletedIds.filter(item => item.startsWith(`${key}:`)).map(item => item.slice(key.length + 1)));
    result[key] = [...byId.values()].filter(record => !deleted.has(record.id));
  }
  return result;
}

export function loadAppData() {
  const local = storage();
  if (!local) return { data: defaults(), deletedIds: [], warning: 'Browser storage is unavailable. Changes will only last for this session.' };
  try {
    const raw = local.getItem(STORAGE_KEY);
    if (!raw) return { data: defaults(), deletedIds: [], warning: '' };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Invalid saved data format');
    // Support the original format, which stored collections at the top level.
    const envelope = parsed.data && typeof parsed.data === 'object' && !Array.isArray(parsed.data);
    const saved = envelope ? parsed.data : parsed;
    const deletedIds = envelope && Array.isArray(parsed.deletedIds)
      ? parsed.deletedIds.filter(item => typeof item === 'string')
      : [];
    const invalidCollections = COLLECTIONS.filter(key => saved[key] !== undefined && !Array.isArray(saved[key]));
    const data = normalizeSavedData(saved, deletedIds);
    return {
      data,
      deletedIds,
      warning: invalidCollections.length ? 'Some invalid saved records were ignored; demonstration records are available.' : '',
    };
  } catch {
    return { data: defaults(), deletedIds: [], warning: 'Saved browser data was damaged or unreadable. Demonstration records were restored.' };
  }
}

export function saveAppData(data, deletedIds = []) {
  const local = storage();
  if (!local) return { ok: false, message: 'Browser storage is unavailable. Changes are only saved for this session.' };
  try {
    local.setItem(STORAGE_KEY, JSON.stringify({ version: 1, data, deletedIds }));
    return { ok: true, message: '' };
  } catch (error) {
    const full = error?.name === 'QuotaExceededError';
    return {
      ok: false,
      message: full
        ? 'Browser storage is full. Changes remain available for this session but could not be saved.'
        : 'Could not save to browser storage. Changes remain available for this session.',
    };
  }
}
