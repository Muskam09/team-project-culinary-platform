import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, ChevronDown, ChevronLeft } from 'lucide-react';
import { getAllRecipes } from '../../data/recipes';
import type { Recipe } from '../../data/recipes';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import Header from '../../components/Header/Header';
import styles from './CollectionPage.module.scss';
import iconBook from '../../assets/menu_icon/icon-park-outline_notebook-one.svg';
import iconEmpty from '../../assets/EmptyPage.png';
import iconEdit from '../../assets/icon-park-outline_edit.svg';
import { addMessage } from '../../data/messagesService';

interface Collection {
  id: string;
  name: string;
  recipes: { id: string; dateSaved: string }[];
}

const CollectionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [collections, setCollections] = useState<Collection[]>(
    JSON.parse(localStorage.getItem('savedCollections') || '[]'),
  );
  const [openMenu, setOpenMenu] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [sortOption, setSortOption] = useState<
  'За популярністю' | 'За кількістю рецептів' | 'За новизною' | 'За залученістю'
  >('За популярністю');

  const collection = collections.find((c) => c.id === id);
  if (!collection) return <p>Колекція не знайдена</p>;

  const savedRecipes: Recipe[] = collection.recipes
    .map((item) => getAllRecipes().find((r) => r.id === item.id))
    .filter((r): r is Recipe => r !== undefined);

  const isEmptyCollection = savedRecipes.length === 0;

  const handleAddRecipeToCollection = (recipe: Recipe) => {
    if (collection.recipes.some((r) => r.id === recipe.id)) return;

    const updatedCollections = collections.map((col) => {
      if (col.id === collection.id) {
        return {
          ...col,
          recipes: [...col.recipes, { id: recipe.id, dateSaved: new Date().toISOString() }],
        };
      }
      return col;
    });

    localStorage.setItem('savedCollections', JSON.stringify(updatedCollections));
    setCollections(updatedCollections);
  };

  useEffect(() => {
    if (!collection || collection.recipes.length === 0) return;

    const processed = JSON.parse(localStorage.getItem('messagesCreated') || '[]') as string[];
    const lastRecipe = [...collection.recipes].sort(
      (a, b) => new Date(b.dateSaved).getTime() - new Date(a.dateSaved).getTime(),
    )[0];

    if (lastRecipe && !processed.includes(lastRecipe.id)) {
      const recipeDetails = getAllRecipes().find((recipe) => recipe.id === lastRecipe.id);
      if (recipeDetails) {
        addMessage({
          title: 'Рецепт успішно збережено',
          text: `Ви зберегли «${recipeDetails.title}» у своїй колекції. Тепер він доступний у ваших збережених рецептах`,
          source: 'Збережені рецепти',
        });

        processed.push(lastRecipe.id);
        localStorage.setItem('messagesCreated', JSON.stringify(processed));
      }
    }
  }, [collection]);

  const handleDeleteRecipe = (recipeId: string) => {
    const updatedCollections = collections.map((col) => {
      if (col.id === collection.id) {
        return { ...col, recipes: col.recipes.filter((r) => r.id !== recipeId) };
      }
      return col;
    });
    localStorage.setItem('savedCollections', JSON.stringify(updatedCollections));
    setCollections(updatedCollections);
    setOpenMenu(false);
  };

  const handleSortSelect = (option: typeof sortOption) => {
    setSortOption(option);
    setSortMenuOpen(false);

    const updatedCollections = collections.map((col) => {
      if (col.id !== collection.id) return col;

      const sortedRecipes: Recipe[] = col.recipes
        .map((item) => getAllRecipes().find((r) => r.id === item.id))
        .filter((r): r is Recipe => r !== undefined);

      switch (option) {
        case 'За популярністю':
          sortedRecipes.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
          break;
        case 'За кількістю рецептів':
          sortedRecipes.sort((a, b) => b.title.length - a.title.length);
          break;
        case 'За новизною':
          sortedRecipes.sort((a, b) => {
            const aDate = col.recipes.find((r) => r.id === a.id)?.dateSaved || '';
            const bDate = col.recipes.find((r) => r.id === b.id)?.dateSaved || '';
            return bDate.localeCompare(aDate);
          });
          break;
        case 'За залученістю':
          sortedRecipes.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
          break;
      }

      return {
        ...col,
        recipes: sortedRecipes.map((r) => ({
          id: r.id,
          dateSaved: col.recipes.find((c) => c.id === r.id)?.dateSaved || '',
        })),
      };
    });

    setCollections(updatedCollections);
  };

  return (
    <main className={styles.main}>
      <Header />
      <div className={styles.mainBlock}>
        <button className={styles.backButton} onClick={() => navigate('/collection')}>
          <ChevronLeft />
          {' '}
          До колекцій
        </button>

        <div className={styles.collectionInfoLine}>
          <div className={styles.collectionNameBlock}>
            <div className={styles.collectionTitleBlock}>
              <div className={styles.titleBlock}>
                <h1 className={styles.collectionName}>{collection.name}</h1>

                <div className={styles.menuWrapper}>
                  <button
                    className={styles.menuButton}
                    onClick={() => setOpenMenu((prev) => !prev)}
                  >
                    <img src={iconEdit} alt="edit" />
                  </button>

                  {openMenu && (
                    <div className={styles.menuPopup}>
                      <button
                        onClick={() => navigate('/recipes', { state: { collectionId: collection.id } })}
                      >
                        Додати рецепт
                      </button>

                      {savedRecipes.length > 0 && (
                        <div>
                          {savedRecipes.map((r) => (
                            <button key={r.id} onClick={() => handleDeleteRecipe(r.id)}>
                              Видалити
                              {' '}
                              {r.title}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {!isEmptyCollection && (
                <div className={styles.savePageButtons}>
                  <div className={styles.sortWrapper}>
                    <button
                      className={styles.allButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSortMenuOpen((prev) => !prev);
                      }}
                    >
                      Сортувати за
                      {' '}
                      <ChevronDown size={16} />
                    </button>

                    {sortMenuOpen && (
                      <div
                        className={styles.dropdownMenu}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {['За популярністю', 'За кількістю рецептів', 'За новизною', 'За залученістю'].map(
                          (option) => (
                            <div
                              key={option}
                              className={`${styles.dropdownItem} ${
                                sortOption === option ? styles.activeItem : ''
                              }`}
                              onClick={() => handleSortSelect(option as typeof sortOption)}
                            >
                              {option}
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className={styles.recipeCountBlock}>
              <img src={iconBook} alt="book" />
              <p className={styles.recipeCount}>
                {savedRecipes.length}
                {' '}
                {savedRecipes.length === 1 ? 'рецепт' : 'рецептів'}
              </p>
            </div>
          </div>
        </div>

        {isEmptyCollection ? (
          <div className={styles.emptyBlock}>
            <img className={styles.emptyImage} src={iconEmpty} alt="empty" />
            <h2 className={styles.emptyTitle}>Ваша колекція порожня</h2>
            <p className={styles.emptyText}>
              Збирайте свої улюблені рецепти
              {' '}
              <br />
              {' '}
              разом в одному місці
            </p>
            <button
              className={styles.ingredientsAddButton}
              onClick={() => navigate('/recipes', { state: { collectionId: collection.id } })}
            >
              Додати рецепт
              {' '}
              <Plus size={16} />
            </button>
          </div>
        ) : (
          <div className={styles.recipesGrid}>
            {savedRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                {...recipe}
                onSave={() => handleAddRecipeToCollection(recipe)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default CollectionPage;
