import React, { useEffect, useState, useRef } from "react";
import { getAllRecipes } from "../data/recipes";
import type { Recipe } from "../data/recipes";
import RecipeCard from "../components/RecipeCard";
import Header from "../components/Header";
import { Plus, ChevronDown } from "lucide-react";
import styles from "./SavedPage.module.scss";
import { useNavigate } from "react-router-dom";
import iconBook from "../assets/menu_icon/icon-park-outline_notebook-one.svg"

interface SavedItem {
  id: string;
  dateSaved: string;
}

interface Collection {
  id: string;
  name: string;
  recipes: SavedItem[];
}

const SavedPage: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<SavedItem[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Закрытие меню при клике вне него
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Загрузка коллекций и сохранённых рецептов
  useEffect(() => {
    const savedCollections = JSON.parse(localStorage.getItem("savedCollections") || "[]");
    if (savedCollections.length > 0) setCollections(savedCollections);

    const recipes = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
    if (recipes.length > 0) setSavedRecipes(recipes);
  }, []);

  const updateCollections = (updated: Collection[]) => {
    setCollections(updated);
    localStorage.setItem("savedCollections", JSON.stringify(updated));
  };

  const handleAddCollection = () => {
    const name = prompt("Назва нової колекції:");
    if (!name) return;
    const newCollection: Collection = { id: Date.now().toString(), name, recipes: [] };
    updateCollections([...collections, newCollection]);
    setShowMenu(false);
  };

  const handleDeleteCollection = (id: string) => {
    if (!window.confirm("Видалити цю колекцію?")) return;
    updateCollections(collections.filter(c => c.id !== id));
  };

  const handleDeleteAllCollections = () => {
    if (!window.confirm("Видалити всі колекції? Це дія незворотна.")) return;
    updateCollections([]);
  };

  const handleDeleteRecipeFromCollection = (collectionId: string, recipeId: string) => {
    const updatedCollections = collections.map(col =>
      col.id === collectionId
        ? { ...col, recipes: col.recipes.filter(r => r.id !== recipeId) }
        : col
    );
    updateCollections(updatedCollections);
  };

  const handleDeleteSavedRecipe = (recipeId: string) => {
    if (!window.confirm("Видалити цей рецепт?")) return;
    const updated = savedRecipes.filter(r => r.id !== recipeId);
    setSavedRecipes(updated);
    localStorage.setItem("savedRecipes", JSON.stringify(updated));
  };

  // Добавление рецепта в коллекцию через drag & drop
  const handleDropRecipe = (recipeId: string, collectionId: string) => {
    const recipe = savedRecipes.find(r => r.id === recipeId);
    if (!recipe) return;

    const updatedCollections = collections.map(col => {
      if (col.id === collectionId) {
        const exists = col.recipes.some(r => r.id === recipeId);
        if (!exists) return { ...col, recipes: [...col.recipes, recipe] };
      }
      return col;
    });
    updateCollections(updatedCollections);

    // Удаляем рецепт из savedRecipes после добавления
    const remaining = savedRecipes.filter(r => r.id !== recipeId);
    setSavedRecipes(remaining);
    localStorage.setItem("savedRecipes", JSON.stringify(remaining));
  };
  const navigate = useNavigate();

  return (
    <main className={styles.main}>
      <Header />

      {/* Меню управления */}
      <div className={styles.savePageButtons}>
        <button className={styles.SortButton}>
          Сортувати за <ChevronDown size={16} className={styles.sortIcon} />
        </button>

        <div className={styles.addCollectionWrapper} ref={menuRef}>
          <button
            className={styles.ingredientsAddButton}
            onClick={() => setShowMenu(prev => !prev)}
          >
            Додати колекцію <Plus size={16} />
          </button>

          {showMenu && (
            <div className={styles.menuDropdown}>
              <button className={styles.menuBtn} onClick={handleAddCollection}>
                ➕ Створити нову
              </button>

              {collections.length > 0 && (
                <>
                  <button className={styles.menuBtn} onClick={handleDeleteAllCollections}>
                    ❌ Видалити всі колекції
                  </button>

                  {collections.map(col =>
                    col.recipes.length > 0 || col.name ? (
                      <div key={col.id} className={styles.deleteRecipesGroup}>
                        <p className={styles.collectionTitle}>{col.name || "Без назви"}</p>
                        <button
                          className={styles.menuBtn}
                          onClick={() => handleDeleteCollection(col.id)}
                        >
                          🗑 Видалити колекцію
                        </button>

                        {col.recipes.map(recipeItem => {
                          const recipe = getAllRecipes().find(r => r.id === recipeItem.id);
                          if (!recipe) return null;
                          return (
                            <button
                              key={recipe.id}
                              className={styles.menuBtn}
                              onClick={() => handleDeleteRecipeFromCollection(col.id, recipe.id)}
                            >
                              🗑 {recipe.title}
                            </button>
                          );
                        })}
                      </div>
                    ) : null
                  )}
                </>
              )}

              {savedRecipes.length > 0 && (
                <div className={styles.deleteRecipesGroup}>
                  <p className={styles.collectionTitle}>Моя колекція</p>
                  {savedRecipes.map(recipeItem => {
                    const recipe = getAllRecipes().find(r => r.id === recipeItem.id);
                    if (!recipe) return null;
                    return (
                      <button
                        key={recipe.id}
                        className={styles.menuBtn}
                        onClick={() => handleDeleteSavedRecipe(recipe.id)}
                      >
                        🗑 {recipe.title}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Отображение коллекций */}
      {collections.length === 0 && savedRecipes.length === 0 ? (
        <p className={styles.empty}>У вас поки немає збережених колекцій.</p>
      ) : (
        <>
          <div className={styles.collectionsGrid}>
            {collections.map(col => {
              const savedInCollection: Recipe[] = col.recipes
                .map(item => getAllRecipes().find(r => r.id === item.id))
                .filter((r): r is Recipe => r !== undefined);

              return (
                <div
                  key={col.id}
                  className={styles.collectionCard}
                    onDrop={(e) => {
                   e.preventDefault();
                    const recipeId = e.dataTransfer.getData("text/plain");
                    handleDropRecipe(recipeId, col.id);
                   }}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => navigate(`/collection/${col.id}`)} // переход по клику
                   >
                  <img className={styles.collectionImage} />
                  <h3 className={styles.collectionName}>{col.name || "Без назви"}</h3>
                  <div className={styles.collectionNameBlock}>
                    <img src={iconBook} alt="book"/>
                  <p className={styles.collectionCount}>
                    {savedInCollection.length}{" "}
                    {savedInCollection.length === 1 ? "рецепт" : "рецептів"}
                  </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Отображение сохранённых рецептов без коллекций */}
          {savedRecipes.length > 0 && (
            <div className={styles.savedRecipesGrid}>
              {savedRecipes.map(recipeItem => {
                const recipe = getAllRecipes().find(r => r.id === recipeItem.id);
                if (!recipe) return null;
                return (
                  <div
                    key={recipe.id}
                    className={styles.savedRecipeCard}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("text/plain", recipe.id)}
                  >
                    <RecipeCard {...recipe} />
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default SavedPage;
