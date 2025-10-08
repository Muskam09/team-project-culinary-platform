import { useState, useEffect } from 'react';
import { getRecipes, getLocalRecipes } from '../services/apiService';
import type { Recipe } from '../data/recipes';

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ⚡ Мгновенно показываем локальные рецепты
    const localData = getLocalRecipes();
    setRecipes(localData);

    // ⚡ Асинхронно пробуем обновить с сервера
    const fetchRecipes = async () => {
      try {
        const serverData = await getRecipes();
        setRecipes(serverData);
      } catch {
        setError('Не вдалось завантажити рецепти з сервера.');
        // локальные уже показаны, ничего страшного
      } finally {
        setLoading(false);
      }
    };

    // Запускаем в фоне
    fetchRecipes();
  }, []);

  return { recipes, loading, error };
};
