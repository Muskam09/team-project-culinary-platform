/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import type { Recipe } from '../data/recipes';
import { sections, summerOffers } from '../data/recipes';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

// ⚡ Ставим короткий таймаут, чтобы не ждать по 30 секунд
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 1500, // 1.5 секунды
});

// --- Локальные рецепты (fallback) ---
export const getLocalRecipes = (): Recipe[] => {
  const sectionRecipes = sections
    .filter((s) => s.type === 'recipes')
    .flatMap((s) => s.items as Recipe[]);
  return [...sectionRecipes, ...summerOffers];
};

// --- Получить все рецепты ---
export const getRecipes = async (): Promise<Recipe[]> => {
  try {
    const res = await api.get<Recipe[]>('/recipes/');
    if (Array.isArray(res.data) && res.data.length > 0) {
      console.log('✅ Загрузил рецепты с сервера');
      return res.data;
    }
    console.warn('Сервер вернул пустой список, fallback на локальные');
    return getLocalRecipes();
  } catch (error) {
    console.warn('❌ Сервер недоступен, fallback на локальные рецепты');
    return getLocalRecipes();
  }
};

// --- Универсальные POST/PUT/DELETE ---
export const postData = async (endpoint: string, payload: any) => {
  try {
    const res = await api.post(endpoint, payload);
    return res.data;
  } catch (error) {
    console.error(`Ошибка POST ${endpoint}:`, error);
    throw error;
  }
};

export default api;
