import React, { useEffect, useState, useRef } from 'react';
import { Plus, ChevronDown, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/Header/Header';
import styles from './SavedPage.module.scss';
import iconBook from '../../assets/menu_icon/icon-park-outline_notebook-one.svg';
import iconEmpty from '../../assets/EmptyPage.png';
import iconRedact from '../../assets/redactCollelection.svg';
import { getAllRecipes } from '../../data/recipes';
import type { Recipe } from '../../data/recipes';
import { getMessages, addMessage } from '../../data/messagesService';
import type { Message } from '../../data/messagesService';
import {
  Collection,
  getCollectionsHybrid,
  createCollectionHybrid,
  updateCollectionHybrid,
  deleteCollectionHybrid
} from '../../services/collectionsService';

interface SavedItem {
  id: string;
  dateSaved: string;
}

const SavedPage: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<SavedItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editCollectionId, setEditCollectionId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [sortOption, setSortOption] = useState<string | null>(null);

  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const [newCollectionCollaborators, setNewCollectionCollaborators] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const messagesCreatedRef = useRef<Set<string>>(new Set());
  const [, setMessages] = useState<Message[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const addedRecipeId: string | undefined = location.state?.addedRecipeId;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // ------------------- INITIAL LOAD -------------------
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const cols = await getCollectionsHybrid();
        setCollections(cols);
      } catch (err) {
        console.error('Ошибка загрузки коллекций:', err);
      }
    };
    fetchCollections();

    const recipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
    setSavedRecipes(recipes);
  }, []);

  // Закрытие меню при клике вне
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(`.${styles.menuWrapper}`)) setOpenMenuId(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ------------------- HELPERS -------------------
  const updateCollectionsState = (updated: Collection[]) => {
    setCollections(updated);
    localStorage.setItem('savedCollections', JSON.stringify(updated));
  };

  const handleSaveCollection = async () => {
    if (!newCollectionName.trim()) return;

    const collectionData = {
      name: newCollectionName,
      description: newCollectionDescription,
      collaborators: newCollectionCollaborators.split(',').map(c => c.trim()),
      recipes: [],
    };

    if (editCollectionId) {
      // Обновляем UI сразу
      setCollections(prev => prev.map(c => c.id === editCollectionId ? { ...c, ...collectionData } : c));
      setShowModal(false);

      try {
        await updateCollectionHybrid(editCollectionId, collectionData);
      } catch (err) {
        console.error('Ошибка при обновлении коллекции:', err);
      }
    } else {
      // Временный ID для мгновенного отображения
      const tempId = `temp-${Date.now()}`;
      const newCol = { id: tempId, ...collectionData };
      setCollections(prev => [...prev, newCol]);
      setShowModal(false);

      try {
        const created = await createCollectionHybrid(collectionData);
        setCollections(prev => prev.map(c => c.id === tempId ? created : c));
      } catch (err) {
        console.error('Ошибка при создании коллекции:', err);
        setCollections(prev => prev.filter(c => c.id !== tempId));
      }
    }

    // Очистка формы
    setEditCollectionId(null);
    setNewCollectionName('');
    setNewCollectionDescription('');
    setNewCollectionCollaborators('');
    setIsPrivate(false);
  };

  const handleDeleteCollection = (id: string) => {
    // UI обновляем сразу
    const collectionToDelete = collections.find(c => c.id === id);
    if (!collectionToDelete) return;

    setCollections(prev => prev.filter(c => c.id !== id));

    // Удаляем рецепты из savedRecipes
    const remainingRecipes = savedRecipes.filter(
      r => !collectionToDelete.recipes.some(rc => rc.id === r.id)
    );
    setSavedRecipes(remainingRecipes);
    localStorage.setItem('savedRecipes', JSON.stringify(remainingRecipes));

    // Асинхронно удаляем на сервере
    deleteCollectionHybrid(id).catch(err => console.error('Ошибка удаления коллекции:', err));
    setOpenMenuId(null);
  };

  const handleDropRecipe = (recipeId: string, collectionId: string) => {
    const recipe = savedRecipes.find(r => r.id === recipeId);
    if (!recipe) return;

    const updatedCollections = collections.map(col => {
      if (col.id === collectionId && !col.recipes.some(r => r.id === recipeId)) {
        return { ...col, recipes: [...col.recipes, recipe] };
      }
      return col;
    });

    updateCollectionsState(updatedCollections);

    const newSavedRecipes = savedRecipes.filter(r => r.id !== recipeId);
    setSavedRecipes(newSavedRecipes);
    localStorage.setItem('savedRecipes', JSON.stringify(newSavedRecipes));
  };

  const handleSortSelect = (option: string) => {
    setSortOption(option);
    setSortMenuOpen(false);
    const sorted = [...collections];
    switch (option) {
      case 'За популярністю':
        sorted.sort((a, b) => b.recipes.length - a.recipes.length);
        break;
      case 'За датою додавання':
        sorted.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      case 'За кількістю рецептів':
        sorted.sort((a, b) => b.recipes.length - a.recipes.length);
        break;
      case 'За назвою':
        sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
    }
    setCollections(sorted);
  };

  const handleCollectionClick = (col: Collection) => {
    if (addedRecipeId && !col.recipes.some(r => r.id === addedRecipeId)) {
      const updatedCollections = collections.map(c =>
        c.id === col.id ? { ...c, recipes: [...c.recipes, { id: addedRecipeId, dateSaved: new Date().toISOString() }] } : c
      );
      setCollections(updatedCollections);
      localStorage.setItem('savedCollections', JSON.stringify(updatedCollections));
    }
    navigate(`/collection/${col.id}`, { state: {} });
  };

  // ------------------- MESSAGES -------------------
  useEffect(() => {
    if (!savedRecipes.length) return;
    const lastSaved = savedRecipes[savedRecipes.length - 1];
    if (messagesCreatedRef.current.has(lastSaved.id)) return;

    const recipeDetails = getAllRecipes().find(r => r.id === lastSaved.id);
    if (!recipeDetails) return;

    addMessage({
      title: 'Рекомендація нового рецепту',
      text: `На основі ваших останніх збережених рецептів, ми вважаємо, що вам сподобається цей рецепт ${recipeDetails.title}!`,
      source: 'Рекомендації',
    });
    messagesCreatedRef.current.add(lastSaved.id);
    setMessages(getMessages());
  }, [savedRecipes]);

  const isEmpty = collections.length === 0 && savedRecipes.length === 0;
  useEffect(() => {
  // Сначала берем данные из localStorage
  const localCollections = JSON.parse(localStorage.getItem('savedCollections') || '[]');
  setCollections(localCollections);

  const localRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
  setSavedRecipes(localRecipes);

  // Асинхронно обновляем с сервера
  const fetchCollections = async () => {
    try {
      const serverCollections = await getCollectionsHybrid();
      setCollections(serverCollections);
      localStorage.setItem('savedCollections', JSON.stringify(serverCollections));
    } catch (err) {
      console.error('Ошибка загрузки коллекций с сервера:', err);
    }
  };

  fetchCollections();
}, []);


  // ------------------- RENDER -------------------
  return (
    <main className={`${styles.main} ${isEmpty ? styles.emptyPage : ''}`} ref={scrollContainerRef}>
      <Header />
      <div className={styles.mainBlock}>
        {!isEmpty && (
          <div className={styles.savePageButtons}>
            <div className={styles.sortWrapper}>
              <button className={styles.allButton} onClick={e => { e.stopPropagation(); setSortMenuOpen(!sortMenuOpen); }}>
                Сортувати за <ChevronDown size={16} />
              </button>
              {sortMenuOpen && (
                <div className={styles.dropdownMenu} onClick={e => e.stopPropagation()}>
                  {['За популярністю', 'За датою додавання', 'За кількістю рецептів', 'За назвою'].map(option => (
                    <div key={option} className={`${styles.dropdownItem} ${sortOption === option ? styles.activeItem : ''}`} onClick={() => handleSortSelect(option)}>
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className={styles.addCollectionWrapper}>
              <button className={styles.ingredientsAddButton} onClick={() => setShowModal(true)}>
                Додати колекцію <Plus size={16} />
              </button>
            </div>
          </div>
        )}

        {isEmpty ? (
          <div className={styles.emptyBlock}>
            <img className={styles.emptyImage} src={iconEmpty} alt="empty" />
            <h1 className={styles.emptyTitle}>У вас ще немає колекцій</h1>
            <p className={styles.emptyText}>Створіть першу, щоб зберігати <br /> улюблені рецепти в одному місці</p>
            <button className={styles.ingredientsAddButton} onClick={() => setShowModal(true)}>
              Додати колекцію <Plus size={16} />
            </button>
          </div>
        ) : (
          <div className={styles.collectionsGrid}>
            {collections.map(col => {
              const savedInCollection: Recipe[] = col.recipes
                .map(item => getAllRecipes().find(r => r.id === item.id))
                .filter((r): r is Recipe => r !== undefined);

              return (
                <div key={col.id} className={styles.collectionCard}
                  onDrop={e => { e.preventDefault(); const recipeId = e.dataTransfer.getData('text/plain'); handleDropRecipe(recipeId, col.id); }}
                  onDragOver={e => e.preventDefault()}
                >
                  <div className={styles.collectionContent} onClick={() => handleCollectionClick(col)}>
                    <div className={styles.collectionImage}>
                      {savedInCollection.length === 0 ? <div className={styles.placeholder} /> :
                        savedInCollection.length === 1 ? <img src={savedInCollection[0].image} alt="img0" className={styles.singleImage} /> :
                          <>
                            {savedInCollection[0] && <img src={savedInCollection[0].image} alt="img0" className={styles.image0} />}
                            {savedInCollection[1] && <img src={savedInCollection[1].image} alt="img1" className={styles.image1} />}
                            {savedInCollection[2] && <img src={savedInCollection[2].image} alt="img2" className={styles.image2} />}
                          </>
                      }

                      <div className={styles.menuWrapper} onClick={e => e.stopPropagation()}>
                        <button className={styles.menuButton} onClick={() => setOpenMenuId(openMenuId === col.id ? null : col.id)}>
                          <img src={iconRedact} alt="redact" />
                        </button>
                        {openMenuId === col.id && (
                          <div className={styles.menuPopup}>
                            <button onClick={() => { setEditCollectionId(col.id); setNewCollectionName(col.name); setNewCollectionDescription(col.description || ''); setNewCollectionCollaborators(col.collaborators?.join(', ') || ''); setShowModal(true); setOpenMenuId(null); }}>Редагувати</button>
                            <button onClick={() => handleDeleteCollection(col.id)}>Видалити</button>
                          </div>
                        )}
                      </div>
                    </div>
                    <h3 className={styles.collectionName}>{col.name || 'Без назви'}</h3>
                    <div className={styles.collectionNameBlock}>
                      <img src={iconBook} alt="book" />
                      <p className={styles.collectionCount}>{savedInCollection.length} {savedInCollection.length === 1 ? 'рецепт' : 'рецептів'}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showModal && (
          <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalHeaderTitle}>{editCollectionId ? 'Редагування колекції' : 'Створення колекції'}</h2>
                <button className={styles.modalClose} onClick={() => setShowModal(false)}><X size={20} /></button>
              </div>

              <p className={styles.inputTitle}>Назва</p>
              <input type="text" placeholder="Наприклад: «Улюблені десерти»" value={newCollectionName} onChange={e => setNewCollectionName(e.target.value)} className={styles.modalInput} />

              <p className={styles.inputTitle}>Опис</p>
              <input type="text" placeholder="Наприклад: «Рецепти, які готую у будні»" value={newCollectionDescription} onChange={e => setNewCollectionDescription(e.target.value)} className={styles.modalInput} />

              <p className={styles.inputTitle}>Запросити співавторів</p>
              <input type="text" placeholder="Ім’я, нікнейм або e-mail співавтора" value={newCollectionCollaborators} onChange={e => setNewCollectionCollaborators(e.target.value)} className={styles.modalInput} />

              <label className={styles.checkboxWrapper}>
                <input type="checkbox" checked={isPrivate} onChange={e => setIsPrivate(e.target.checked)} />
                <div className={styles.checkboxText}>
                  <h1 className={styles.checkboxTitle}>Приховати колекцію від інших</h1>
                  <p className={styles.checkboxDescription}>Колекція стане доступною лише вам</p>
                </div>
              </label>

              <button onClick={handleSaveCollection} className={styles.modalCreate} disabled={!newCollectionName.trim()}>
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
