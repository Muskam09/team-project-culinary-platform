import React, { useState, useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import styles from './SelectRecipeModal.module.scss';
import type { Recipe } from '../../data/recipes';
import { getAllRecipes } from '../../data/recipes';
import CollectionModal from '../CollectionModal/CollectionModal';
import iconBook from '../../assets/menu_icon/icon-park-outline_notebook-one.svg';
import searchIcon from '../../assets/icon-park-outline_search.svg';

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

interface SelectRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  onSelectRecipe?: (recipe: Recipe) => void;
}

const MAX_SUGGESTIONS = 10;

const SelectRecipeModal: React.FC<SelectRecipeModalProps> = ({
  isOpen,
  onClose,
  onBack,
  onSelectRecipe,
}) => {
  const [search, setSearch] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activeCollection, setActiveCollection] = useState<Collection | null>(null);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);

  // Загрузка коллекций из localStorage
  useEffect(() => {
    const savedCollections = JSON.parse(localStorage.getItem('savedCollections') || '[]');
    setCollections(savedCollections);
  }, []);

  // Фильтрация рецептов по поиску
  useEffect(() => {
    if (!search) {
      setFilteredRecipes([]);
      return;
    }
    const matches = getAllRecipes()
      .filter((r) => r.title.toLowerCase().includes(search.toLowerCase()))
      .slice(0, MAX_SUGGESTIONS);
    setFilteredRecipes(matches);
  }, [search]);

  const highlightMatch = (text: string) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, 'gi');
    return text.split(regex).map((part, idx) => (regex.test(part) ? (
      <span key={idx} className={styles.highlight}>
        {part}
      </span>
    ) : (
      part
    )));
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header главной модалки */}
        <div className={styles.header}>
          <button
            className={styles.backTextBtn}
            onClick={() => {
              if (onBack) {
                onBack(); // открываем предыдущее окно
              } else {
                onClose(); // если onBack не передали — просто закрыть
              }
            }}
          >
            <ChevronLeft size={18} />
            Назад
          </button>

          <h2 className={styles.title}>Додати страву</h2>

          <div className={styles.rightButtons}>
            <button
              className={styles.closeBtn}
              aria-label="Закрити"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Поисковое поле */}
        <div className={styles.searchWrapperBlock}>
          <div className={styles.searchWrapper}>
            <img className={styles.searchIcon} src={searchIcon} alt="search" />
            <input
              type="text"
              placeholder="Введіть назву рецепту"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {/* Результаты поиска */}
          {search && (
          <div className={styles.suggestions}>
            {filteredRecipes.length > 0 ? (
              filteredRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className={styles.suggestionItem}
                  onClick={() => {
                    if (onSelectRecipe) onSelectRecipe(recipe);
                    onClose();
                  }}
                >
                  {highlightMatch(recipe.title)}
                </div>
              ))
            ) : (
              <p>Рецепти не знайдені</p>
            )}
          </div>
          )}
        </div>

        {/* Сохранённые коллекции */}
        <div className={styles.savedBlock}>
          <h3 className={styles.savedBlockTitle}>Збережене</h3>
          <div className={styles.collectionsGrid}>
            {collections.map((col) => (
              <div
                key={col.id}
                className={styles.collectionCard}
                onClick={() => {
                  setActiveCollection(col);
                  setIsCollectionModalOpen(true);
                }}
              >
                <div className={styles.collectionImage}>
                  {col.recipes[0] && (
                    <img src={getAllRecipes().find((r) => r.id === col.recipes[0].id)?.image} alt="" />
                  )}
                  {col.recipes[1] && (
                    <img src={getAllRecipes().find((r) => r.id === col.recipes[1].id)?.image} alt="" />
                  )}
                  {col.recipes[2] && (
                    <img src={getAllRecipes().find((r) => r.id === col.recipes[2].id)?.image} alt="" />
                  )}
                </div>
                <h4>{col.name}</h4>
                <div className={styles.collectionCount}>
                  <img src={iconBook} alt="book" />
                  <span>
                    {col.recipes.length}
                    {' '}
                    рецепт
                    {col.recipes.length !== 1 ? 'ів' : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Модалка коллекции */}
      <CollectionModal
        isOpen={isCollectionModalOpen}
        collection={activeCollection}
        onClose={() => setIsCollectionModalOpen(false)}
        onBack={() => setIsCollectionModalOpen(false)}
        onSelectRecipe={onSelectRecipe}
      />
    </div>
  );
};

export default SelectRecipeModal;
