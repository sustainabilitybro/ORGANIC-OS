// Local storage utilities

const STORAGE_PREFIX = 'organic_os_';

function getKey(key: string): string {
  return `${STORAGE_PREFIX}${key}`;
}

export function storageGet(key: string, defaultValue: string = ''): string {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    return localStorage.getItem(getKey(key)) || defaultValue;
  } catch {
    return defaultValue;
  }
}

export function storageSet(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(getKey(key), value);
  } catch {
    // Ignore
  }
}

export function storageRemove(key: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(getKey(key));
  } catch {
    // Ignore
  }
}

export function storageClear(): void {
  if (typeof window === 'undefined') return;
  
  try {
    Object.keys(localStorage)
      .filter(key => key.startsWith(STORAGE_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  } catch {
    // Ignore
  }
}

export function storageGetJson<T>(key: string, defaultValue: T): T {
  try {
    const item = storageGet(key);
    if (!item) return defaultValue;
    return JSON.parse(item);
  } catch {
    return defaultValue;
  }
}

export function storageSetJson<T>(key: string, value: T): void {
  storageSet(key, JSON.stringify(value));
}
