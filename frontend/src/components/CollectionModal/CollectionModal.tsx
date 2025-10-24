import React, { useState, useRef } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import styles from './CollectionModal.module.scss';
import type { Recipe } from '../../data/recipes';
import { getAllRecipes } from '../../data/recipes';

interface SavedItem {
  id: string;
  dateSaved: string;
}

interface Collection {
  id: string;
  name: string;
  description?: string;
  collaborators?: string[];
  recipes: SavedItem[];
}

interface CollectionModalProps {
  isOpen: boolean;
  collection: Collection | null;
  onClose: () => void;
  onBack?: () => void;
  onSelectRecipe?: (recipe: Recipe) => void;
}

const CollectionModal: React.FC<CollectionModalProps> = ({
  isOpen,
  collection,
  onClose,
  onBack,
  onSelectRecipe,
}) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !collection) return null;

  const recipesInCollection: Recipe[] = collection.recipes
    .map((item) => getAllRecipes().find((r) => r.id === item.id))
    .filter((r): r is Recipe => r !== undefined);

  // сброс выделения при клике внутри модалки, но не по карточке
  const handleModalClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest(`.${styles.recipeCard}`)) {
      setSelectedRecipe(null);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        ref={modalRef}
        onClick={(e) => {
          e.stopPropagation(); // блок закрытия модалки
          handleModalClick(e); // проверяем, был ли клик вне карточки
        }}
      >
        {/* Header */}
        <div className={styles.header}>
          {onBack && (
            <button className={styles.backBtn} onClick={onBack}>
              <ChevronLeft size={20} />
              Назад
            </button>
          )}
          <h2 className={styles.title}>{collection.name}</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Recipes Grid */}
        <div className={styles.recipesBlock}>
          <div className={styles.recipesGrid}>
            {recipesInCollection.map((recipe) => (
              <div
                key={recipe.id}
                className={`${styles.recipeCard} ${
                  selectedRecipe?.id === recipe.id ? styles.selected : ''
                }`}
                onClick={() => setSelectedRecipe(recipe)}
              >
                <div
                  className={styles.recipeImage}
                  style={{ backgroundImage: `url(${recipe.image})` }}
                />
                <h4 className={styles.recipeTitle}>{recipe.title}</h4>
              </div>
            ))}
            {recipesInCollection.length === 0 && (
              <p className={styles.emptyText}>Рецепти відсутні</p>
            )}
          </div>
        </div>

        {/* Add Recipe Button */}
        <button
          className={`${styles.addRecipeBtn} ${selectedRecipe ? styles.active : ''}`}
          onClick={() => {
            if (selectedRecipe && onSelectRecipe) {
              onSelectRecipe(selectedRecipe);
              onClose();
            } else {
              alert('Оберіть рецепт перед додаванням');
            }
          }}
        >
          Додати рецепт
        </button>
      </div>
    </div>
  );
};

export default CollectionModal;
