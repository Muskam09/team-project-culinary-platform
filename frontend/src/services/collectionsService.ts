/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

export interface Collection {
  id: string;
  name: string;
  description?: string;
  collaborators?: string[];
  recipes: { id: string; dateSaved: string }[];
}

const API_BASE = 'http://localhost:8000/api/v1/collections/';
const REFRESH_URL = 'http://localhost:8000/api/auth/token/refresh/';

let collectionsCache: Collection[] | null = null;

// ------------------- AUTH -------------------
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const refreshToken = async (): Promise<boolean> => {
  try {
    const refresh = localStorage.getItem('refreshToken');
    if (!refresh) return false;

    const { data } = await axios.post(REFRESH_URL, { refresh });
    localStorage.setItem('accessToken', data.access);
    return true;
  } catch {
    return false;
  }
};

const requestWithRefresh = async <T>(fn: () => Promise<T>): Promise<T> => {
  try {
    return await fn();
  } catch (err: any) {
    if (err.response?.status === 401) {
      const refreshed = await refreshToken();
      if (refreshed) return await fn();
    }
    throw err;
  }
};

// ------------------- LOCALSTORAGE HELPERS -------------------
const readLocal = (): Collection[] => {
  try {
    return JSON.parse(localStorage.getItem('savedCollections') || '[]');
  } catch {
    return [];
  }
};

const writeLocalAsync = (data: Collection[]) => {
  // Асинхронная запись, чтобы не блокировать рендер
  setTimeout(() => localStorage.setItem('savedCollections', JSON.stringify(data)), 0);
};

// ------------------- HYBRID COLLECTIONS -------------------
export const getCollectionsHybrid = async (): Promise<Collection[]> => {
  if (collectionsCache) return collectionsCache; // быстрый возврат если уже загрузили

  const local = readLocal();

  try {
    const { data } = await requestWithRefresh(() =>
      axios.get<Collection[]>(API_BASE, { headers: getAuthHeaders() })
    );
    collectionsCache = data;
    writeLocalAsync(data);
    return data;
  } catch {
    collectionsCache = local;
    return local;
  }
};

export const createCollectionHybrid = async (collection: Omit<Collection, 'id'>): Promise<Collection> => {
  try {
    const { data } = await requestWithRefresh(() =>
      axios.post<Collection>(API_BASE, collection, { headers: getAuthHeaders() })
    );
    collectionsCache = collectionsCache ? [...collectionsCache, data] : [data];
    writeLocalAsync(collectionsCache);
    return data;
  } catch {
    const saved = readLocal();
    const newCol: Collection = { ...collection, id: Date.now().toString() + Math.floor(Math.random() * 1000) };
    const updated = [...saved, newCol];
    writeLocalAsync(updated);
    collectionsCache = updated;
    return newCol;
  }
};

export const updateCollectionHybrid = async (id: string, collection: Partial<Collection>): Promise<Collection> => {
  try {
    const { data } = await requestWithRefresh(() =>
      axios.put<Collection>(`${API_BASE}${id}/`, collection, { headers: getAuthHeaders() })
    );
    if (collectionsCache) collectionsCache = collectionsCache.map(c => (c.id === id ? data : c));
    writeLocalAsync(collectionsCache || []);
    return data;
  } catch {
    const saved = readLocal();
    const updated = saved.map(c => (c.id === id ? { ...c, ...collection } : c));
    writeLocalAsync(updated);
    collectionsCache = updated;
    return updated.find(c => c.id === id)!;
  }
};

export const deleteCollectionHybrid = async (id: string): Promise<void> => {
  try {
    await requestWithRefresh(() =>
      axios.delete(`${API_BASE}${id}/`, { headers: getAuthHeaders() })
    );
    if (collectionsCache) collectionsCache = collectionsCache.filter(c => c.id !== id);
    writeLocalAsync(collectionsCache || []);
  } catch {
    const saved = readLocal();
    const updated = saved.filter(c => c.id !== id);
    writeLocalAsync(updated);
    collectionsCache = updated;
  }
};
