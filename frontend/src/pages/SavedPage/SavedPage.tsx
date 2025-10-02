// src/pages/SavedPage.tsx
import React, { useEffect, useState, useRef } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllRecipes } from '../../data/recipes';
import type { Recipe } from '../../data/recipes';
import Header from '../../components/Header/Header';
import styles from './SavedPage.module.scss';
import iconBook from '../../assets/menu_icon/icon-park-outline_notebook-one.svg';
import iconEmpty from '../../assets/EmptyPage.png';
import iconRedact from '../../assets/redactCollelection.svg';
import { getMessages, addMessage } from '../../data/messagesService';
import type { Message } from '../../data/messagesService';

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

const SavedPage: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<SavedItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editCollectionId, setEditCollectionId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const messagesCreatedRef = useRef<Set<string>>(new Set());
  const [, setMessages] = useState<Message[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollDirectionRef = useRef<'up' | 'down' | null>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const addedRecipeId: string | undefined = location.state?.addedRecipeId;

  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [sortOption, setSortOption] = useState<string | null>(null);

  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const [newCollectionCollaborators, setNewCollectionCollaborators] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  // Загрузка из localStorage
  useEffect(() => {
    const savedCollections = JSON.parse(localStorage.getItem('savedCollections') || '[]');
    const recipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
    setCollections(savedCollections);
    setSavedRecipes(recipes);
  }, []);

  // Закрытие меню при клике вне
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(`.${styles.menuWrapper}`)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateCollections = (updated: Collection[]) => {
    setCollections(updated);
    localStorage.setItem('savedCollections', JSON.stringify(updated));
  };

  const handleSaveCollection = () => {
    if (!newCollectionName.trim()) return;

    if (editCollectionId) {
      const updatedCollections = collections.map((col) => (col.id === editCollectionId
        ? {
          ...col,
          name: newCollectionName,
          description: newCollectionDescription,
          collaborators: newCollectionCollaborators.split(',').map((c) => c.trim()),
        }
        : col));
      updateCollections(updatedCollections);
    } else {
      const newCollection: Collection = {
        id: Date.now().toString(),
        name: newCollectionName,
        description: newCollectionDescription,
        collaborators: newCollectionCollaborators.split(',').map((c) => c.trim()),
        recipes: [],
      };
      updateCollections([...collections, newCollection]);
    }

    setShowModal(false);
    setEditCollectionId(null);
    setNewCollectionName('');
    setNewCollectionDescription('');
    setNewCollectionCollaborators('');
    setIsPrivate(false);
  };

  const handleDropRecipe = (recipeId: string, collectionId: string) => {
    const recipe = savedRecipes.find((r) => r.id === recipeId);
    if (!recipe) return;

    const updatedCollections = collections.map((col) => {
      if (col.id === collectionId) {
        const exists = col.recipes.some((r) => r.id === recipeId);
        if (!exists) return { ...col, recipes: [...col.recipes, recipe] };
      }
      return col;
    });

    updateCollections(updatedCollections);

    const newSavedRecipes = savedRecipes.filter((r) => r.id !== recipeId);
    setSavedRecipes(newSavedRecipes);
    localStorage.setItem('savedRecipes', JSON.stringify(newSavedRecipes));
  };

  const handleDragEnd = () => {
    scrollDirectionRef.current = null;
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  const isEmpty = collections.length === 0 && savedRecipes.length === 0;

  const onEdit = (id: string) => {
    const collection = collections.find((c) => c.id === id);
    if (!collection) return;

    setEditCollectionId(id);
    setNewCollectionName(collection.name);
    setNewCollectionDescription(collection.description || '');
    setNewCollectionCollaborators(collection.collaborators?.join(', ') || '');
    setShowModal(true);
    setOpenMenuId(null);
  };

  const onDelete = (id: string) => {
    const collectionToDelete = collections.find((col) => col.id === id);
    if (!collectionToDelete) return;

    // Удаляем рецепты коллекции из savedRecipes
    const remainingRecipes = savedRecipes.filter(
      (r) => !collectionToDelete.recipes.some((rc) => rc.id === r.id),
    );
    setSavedRecipes(remainingRecipes);
    localStorage.setItem('savedRecipes', JSON.stringify(remainingRecipes));

    // Удаляем коллекцию
    const updatedCollections = collections.filter((col) => col.id !== id);
    updateCollections(updatedCollections);

    setOpenMenuId(null);
  };

  const handleSortSelect = (option: string) => {
    setSortOption(option);
    setSortMenuOpen(false);

    const sortedCollections = [...collections];

    switch (option) {
      case 'За популярністю':
        sortedCollections.sort((a, b) => b.recipes.length - a.recipes.length);
        break;
      case 'За датою додавання':
        sortedCollections.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      case 'За кількістю рецептів':
        sortedCollections.sort((a, b) => b.recipes.length - a.recipes.length);
        break;
      case 'За назвою':
        sortedCollections.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
    }

    setCollections(sortedCollections);
  };

const handleCollectionClick = (col: Collection) => {
  if (addedRecipeId) {
    const alreadyAdded = col.recipes.some(r => r.id === addedRecipeId);
    if (!alreadyAdded) {
      const updatedCollections = collections.map(c => 
        c.id === col.id 
          ? { ...c, recipes: [...c.recipes, { id: addedRecipeId, dateSaved: new Date().toISOString() }] }
          : c
      );
      setCollections(updatedCollections);
      localStorage.setItem('savedCollections', JSON.stringify(updatedCollections));
    }
  }

  // Перехід в саму колекцію
  navigate(`/collection/${col.id}`, { state: {} });

};


  useEffect(() => {
    if (savedRecipes.length === 0) return;

    const lastSaved = savedRecipes[savedRecipes.length - 1];

    if (messagesCreatedRef.current.has(lastSaved.id)) return; // уже есть сообщение

    const recipeDetails = getAllRecipes().find((r) => r.id === lastSaved.id);
    if (!recipeDetails) return;

    addMessage({
      title: 'Рекомендація нового рецепту',
      text: `На основі ваших останніх збережених рецептів, ми вважаємо, що вам сподобається цей рецепт ${recipeDetails.title}!`,
      source: 'Рекомендації',
    });

    messagesCreatedRef.current.add(lastSaved.id); // отмечаем, что сообщение создано
    setMessages(getMessages());
  }, [savedRecipes]);

  

  return (
    <main
      className={`${styles.main} ${isEmpty ? styles.emptyPage : ''}`}
      ref={scrollContainerRef}
      onDragEnd={handleDragEnd}
    >
      <Header />
      <div className={styles.mainBlock}>
        {!isEmpty && (
        <div className={styles.savePageButtons}>
          <div className={styles.sortWrapper}>
            <button
              className={styles.allButton}
              onClick={(e) => { e.stopPropagation(); setSortMenuOpen(!sortMenuOpen); }}
            >
              Сортувати за
              {' '}
              <ChevronDown size={16} />
            </button>

            {sortMenuOpen && (
              <div className={styles.dropdownMenu} onClick={(e) => e.stopPropagation()}>
                {['За популярністю', 'За датою додавання', 'За кількістю рецептів', 'За назвою'].map((option) => (
                  <div
                    key={option}
                    className={`${styles.dropdownItem} ${sortOption === option ? styles.activeItem : ''}`}
                    onClick={() => handleSortSelect(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.addCollectionWrapper}>
            <button
              className={styles.ingredientsAddButton}
              onClick={() => setShowModal(true)}
            >
              Додати колекцію
              {' '}
              <Plus size={16} />
            </button>
          </div>
        </div>
        )}

        {isEmpty ? (
          <div className={styles.emptyBlock}>
            <img className={styles.emptyImage} src={iconEmpty} alt="empty" />
            <h1 className={styles.emptyTitle}>У вас ще немає колекцій</h1>
            <p className={styles.emptyText}>
              Створіть першу, щоб зберігати
              {' '}
              <br />
              {' '}
              улюблені рецепти в одному місці
            </p>
            <button
              className={styles.ingredientsAddButton}
              onClick={() => setShowModal(true)}
            >
              Додати колекцію
              {' '}
              <Plus size={16} />
            </button>
          </div>
        ) : (
          <div className={styles.collectionsGrid}>
            {collections.map((col) => {
              const savedInCollection: Recipe[] = col.recipes
                .map((item) => getAllRecipes().find((r) => r.id === item.id))
                .filter((r): r is Recipe => r !== undefined);

              return (
                <div
                  key={col.id}
                  className={styles.collectionCard}
                  onDrop={(e) => {
                    e.preventDefault();
                    const recipeId = e.dataTransfer.getData('text/plain');
                    handleDropRecipe(recipeId, col.id);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <div
                    className={styles.collectionContent}
                    onClick={() => handleCollectionClick(col)}
                  >
                    <div className={styles.collectionImage}>
                      {savedInCollection.length === 0 ? (
                        <div className={styles.placeholder} />
                      ) : savedInCollection.length === 1 ? (
                        <img src={savedInCollection[0].image} alt="img0" className={styles.singleImage} />
                      ) : (
                        <>
                          {savedInCollection[0] && <img src={savedInCollection[0].image} alt="img0" className={styles.image0} />}
                          {savedInCollection[1] && <img src={savedInCollection[1].image} alt="img1" className={styles.image1} />}
                          {savedInCollection[2] && <img src={savedInCollection[2].image} alt="img2" className={styles.image2} />}
                        </>
                      )}

                      <div className={styles.menuWrapper} onClick={(e) => e.stopPropagation()}>
                        <button
                          className={styles.menuButton}
                          onClick={() => setOpenMenuId(openMenuId === col.id ? null : col.id)}
                        >
                          <img src={iconRedact} alt="redact" />
                        </button>
                        {openMenuId === col.id && (
                        <div className={styles.menuPopup}>
                          <button onClick={() => onEdit(col.id)}>Редагувати</button>
                          <button onClick={() => onDelete(col.id)}>Видалити</button>
                        </div>
                        )}
                      </div>
                    </div>

                    <h3 className={styles.collectionName}>{col.name || 'Без назви'}</h3>
                    <div className={styles.collectionNameBlock}>
                      <img src={iconBook} alt="book" />
                      <p className={styles.collectionCount}>
                        {savedInCollection.length}
                        {' '}
                        {savedInCollection.length === 1 ? 'рецепт' : 'рецептів'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalHeaderTitle}>{editCollectionId ? 'Редагування колекції' : 'Створення колекції'}</h2>
              <button className={styles.modalClose} onClick={() => setShowModal(false)}>✖</button>
            </div>

            <p className={styles.inputTitle}>Назва</p>
            <input
              type="text"
              placeholder="Наприклад: «Улюблені десерти»"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              className={styles.modalInput}
            />

            <p className={styles.inputTitle}>Опис</p>
            <input
              type="text"
              placeholder="Наприклад: «Рецепти, які готую у будні»"
              value={newCollectionDescription}
              onChange={(e) => setNewCollectionDescription(e.target.value)}
              className={styles.modalInput}
            />

            <p className={styles.inputTitle}>Запросити співавторів</p>
            <input
              type="text"
              placeholder="Ім’я, нікнейм або e-mail співавтора"
              value={newCollectionCollaborators}
              onChange={(e) => setNewCollectionCollaborators(e.target.value)}
              className={styles.modalInput}
            />

            <label className={styles.checkboxWrapper}>
              <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />
              <span className={styles.customCheckbox} />
              <div className={styles.checkboxText}>
                <h1 className={styles.checkboxTitle}>Приховати колекцію від інших</h1>
                <p className={styles.checkboxText}>Колекція стане доступною лише вам</p>
              </div>
            </label>

            <button
              onClick={handleSaveCollection}
              className={styles.modalCreate}
              disabled={!newCollectionName.trim()}
            >
              {editCollectionId ? 'Зберегти зміни' : 'Створити колекцію'}
            </button>
          </div>
        </div>
        )}
      </div>
    </main>
  );
};

export default SavedPage;
