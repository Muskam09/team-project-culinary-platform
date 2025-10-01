// ShoppingListPage.tsx
import React, { useState, useEffect } from 'react';
import { Plus, ChevronDown, MoreVertical } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/Header/Header';
import styles from './ShoppingListPage.module.scss';
import CreateListModal from '../../components/CreateListModal/CreateListModal';
import emptyList from '../../assets/EmptyLists.png';

interface ShoppingItem {
  id: string;
  name: string;
  amount?: number;
  unit?: string;
  checked?: boolean;
}

interface ShoppingList {
  id: string;
  name: string;
  description?: string;
  color?: string;
  items: ShoppingItem[];
  createdAt: string;
}

const ShoppingListPage: React.FC = () => {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingList, setEditingList] = useState<ShoppingList | null>(null);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [sortOption, setSortOption] = useState<string>('default');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const savedLists = JSON.parse(localStorage.getItem('shoppingLists') || '[]');
    setLists(savedLists);
  }, []);

  const updateLists = (updated: ShoppingList[]) => {
    setLists(updated);
    localStorage.setItem('shoppingLists', JSON.stringify(updated));
  };

  const handleSortSelect = (option: string) => {
    setSortOption(option);
    setSortMenuOpen(false);
  };

  const sortedLists = [...lists].sort((a, b) => {
    switch (sortOption) {
      case 'За назвою':
        return a.name.localeCompare(b.name);
      case 'За датою створення':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'За кількістю інгредієнтів':
        return a.items.length - b.items.length;
      default:
        return 0;
    }
  });

  // Создание нового списка
  const handleCreateList = (name: string, description: string, color: string) => {
    const newList: ShoppingList = {
      id: Date.now().toString(),
      name,
      description,
      color,
      items: [],
      createdAt: new Date().toISOString(),
    };
    updateLists([...lists, newList]);
    setIsCreateModalOpen(false);
  };

  // Редактирование существующего списка
  const handleUpdateList = (id: string, name: string, description: string, color: string) => {
    const updated = lists.map((list) => (list.id === id ? {
      ...list, name, description, color,
    } : list));
    updateLists(updated);
    setEditingList(null);
  };

  const getListProgress = (list: ShoppingList) => {
    if (list.items.length === 0) return 0;
    const checkedCount = list.items.filter((item) => item.checked).length;
    return (checkedCount / list.items.length) * 100;
  };

  const noLists = sortedLists.length === 0;

  // Удаление списка
  const handleDeleteList = (id: string) => {
    const updated = lists.filter((list) => list.id !== id);
    updateLists(updated);
    setOpenMenuId(null);
  };

  // Открыть модалку для редактирования
  const handleEditList = (list: ShoppingList) => {
    setEditingList(list);
    setOpenMenuId(null);
  };

  // Клик вне меню закрывает открытое меню
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(`.${styles.cardMenu}`)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <main className={styles.main}>
      <Header />
      <div className={styles.mainBlock}>
        {!noLists && (
        <div className={styles.savePageButtons}>
          <div className={styles.sortWrapper}>
            <button
              className={styles.SortButton}
              onClick={(e) => {
                e.stopPropagation();
                setSortMenuOpen(!sortMenuOpen);
              }}
            >
              Сортувати за
              {' '}
              <ChevronDown size={20} className={styles.sortIcon} />
            </button>

            {sortMenuOpen && (
              <div className={styles.dropdownMenu} onClick={(e) => e.stopPropagation()}>
                {['За назвою', 'За датою створення', 'За кількістю інгредієнтів'].map((option) => (
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
              className={styles.addListBtn}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Додати список
              {' '}
              <Plus size={20} />
            </button>
          </div>
        </div>
        )}

        {noLists ? (
          <div className={styles.emptyLists}>
            <img src={emptyList} alt="emptyList" className={styles.emptyImage} />
            <h2>У вас ще немає списків</h2>
            <p>
              Створіть свій перший список
              <br />
              {' '}
              продуктів для зручних покупок.
            </p>
            <button className={styles.addListBtn} onClick={() => setIsCreateModalOpen(true)}>
              Додати список
              {' '}
              <Plus size={20} />
            </button>
          </div>
        ) : (
          <div className={styles.shoppingPageGrid}>
            <div className={styles.listsColumn}>
              {sortedLists.map((list) => {
                const createdDate = new Date(list.createdAt).toLocaleDateString('uk-UA', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                });

                return (
                  <div
                    key={list.id}
                    className={styles.collectionCard}
                    onClick={(e) => {
                    // если клик был на меню, не открываем страницу
                      if ((e.target as HTMLElement).closest(`.${styles.cardMenu}`)) return;

                      const itemsFromRecipe: ShoppingItem[] = location.state?.ingredientsToAdd || [];
                      if (itemsFromRecipe.length > 0) {
                        const updated = lists.map((l) => (l.id === list.id ? { ...l, items: [...l.items, ...itemsFromRecipe] } : l));
                        updateLists(updated);
                        navigate(`/shopping-list/${list.id}`, { replace: true, state: {} });
                      } else {
                        navigate(`/shopping-list/${list.id}`);
                      }
                    }}
                  >
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardTitle}>{list.name}</h3>

                      <div className={styles.cardMenu}>
                        <button
                          className={styles.menuButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === list.id ? null : list.id);
                          }}
                        >
                          <MoreVertical size={20} />
                        </button>

                        {openMenuId === list.id && (
                        <div
                          className={styles.menuDropdown}
                          onClick={(e) => e.stopPropagation()} // важно, чтобы клики не всплывали
                        >
                          <div onClick={() => handleEditList(list)}>Редагувати</div>
                          <div onClick={() => handleDeleteList(list.id)}>Видалити</div>
                        </div>
                        )}
                      </div>
                    </div>

                    <p className={styles.createdDate}>{createdDate}</p>

                    <div className={styles.progressLabel}>
                      <p className={styles.progressTitle}>Прогрес</p>
                      {list.items.filter((item) => item.checked).length}
                      {' '}
                      із
                      {list.items.length}
                      {' '}
                      продуктів
                    </div>
                    <div className={styles.progressBarBackground}>
                      <div
                        className={styles.progressBarFill}
                        style={{
                          width: `${getListProgress(list)}%`,
                          backgroundColor: list.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {isCreateModalOpen && (
        <CreateListModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateList}
        />
        )}

        {editingList && (
        <CreateListModal
          initialData={{
            id: editingList.id,
            name: editingList.name,
            description: editingList.description,
            color: editingList.color,
          }}
          onClose={() => setEditingList(null)}
          onCreate={handleCreateList} // для новых всё равно есть
          onEdit={(updated) => handleUpdateList(
            updated.id,
            updated.name,
            updated.description,
            updated.color,
          )}
        />
        )}

      </div>
    </main>
  );
};

export default ShoppingListPage;
