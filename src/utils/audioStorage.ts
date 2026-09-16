import { ConversionHistoryItem } from '../types/tts';

const DB_NAME = 'GoogleCloudTTS_DB';
const DB_VERSION = 1;
const STORE_NAME = 'audio_history';
const LOCAL_STORAGE_KEY = 'tts_conversion_history_meta';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB is not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveHistoryItem(item: ConversionHistoryItem): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(item);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB write failed, falling back to localStorage metadata', err);
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      const list: ConversionHistoryItem[] = raw ? JSON.parse(raw) : [];
      // Keep max 20 items to avoid quota exceed
      const updated = [item, ...list.filter((x) => x.id !== item.id)].slice(0, 20);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (lsErr) {
      console.error('LocalStorage backup failed:', lsErr);
    }
  }
}

export async function getHistoryItems(): Promise<ConversionHistoryItem[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => {
        const items = (req.result as ConversionHistoryItem[]) || [];
        items.sort((a, b) => b.createdAt - a.createdAt);
        resolve(items);
      };
      req.onerror = () => {
        resolve(getFallbackLocalStorage());
      };
    });
  } catch {
    return getFallbackLocalStorage();
  }
}

function getFallbackLocalStorage(): ConversionHistoryItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function deleteHistoryItem(id: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB delete failed', err);
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const list: ConversionHistoryItem[] = JSON.parse(raw);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list.filter((x) => x.id !== id)));
    }
  } catch {}
}

export async function clearAllHistory(): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB clear failed', err);
  }

  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch {}
}

// Download helper for MP3 / WAV
export function triggerAudioDownload(
  base64Data: string,
  mimeType: string,
  filename: string
): void {
  try {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 5000);
  } catch (err) {
    console.error('Download trigger error:', err);
  }
}
