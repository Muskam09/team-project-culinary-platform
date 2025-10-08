// src/pages/ShoppingListPage.tsx
import React, { useState, useEffect } from 'react';
import { Plus, ChevronDown, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
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

const API_BASE = 'http://localhost:8000/api/v1/shopping-lists/';
const AUTH_REFRESH = 'http://localhost:8000/api/auth/token/refresh/';

const ShoppingListPage: React.FC = () => {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingList, setEditingList] = useState<ShoppingList | null>(null);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [sortOption, setSortOption] = useState<string>('default');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const navigate = useNavigate();

  // -------------------- AUTH HELPERS --------------------
  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const refreshToken = async (): Promise<boolean> => {
    const refresh = localStorage.getItem('refreshToken');
    if (!refresh) return false;
    try {
      const { data } = await axios.post(AUTH_REFRESH, { refresh });
      localStorage.setItem('accessToken', data.access);
      return true;
    } catch {
      return false;
    }
  };

  // -------------------- FETCH --------------------
  useEffect(() => {
    // Сначала загружаем из localStorage
    const local = JSON.parse(localStorage.getItem('shoppingLists') || '[]');
    setLists(local);

    // Асинхронно обновляем с сервера
    const fetchFromServer = async () => {
      try {
        const { data } = await axios.get<ShoppingList[]>(API_BASE, { headers: getAuthHeaders() });
        setLists(data);
        localStorage.setItem('shoppingLists', JSON.stringify(data));
      } catch (err) {
        const axiosErr = err as AxiosError;
        if (axiosErr.response?.status === 401) {
          const refreshed = await refreshToken();
          if (refreshed) {
            fetchFromServer(); // повторная попытка
            return;
          }
        }
        console.warn('Сервер недоступен, fallback на localStorage', err);
      }
    };

    fetchFromServer();
  }, []);

  // -------------------- UPDATE LOCAL --------------------
  const updateLists = (updated: ShoppingList[]) => {
    setLists(updated);
    localStorage.setItem('shoppingLists', JSON.stringify(updated));
  };

  // -------------------- SORT --------------------
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

  // -------------------- CRUD --------------------
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
  };

  const handleUpdateList = (id: string, name: string, description: string, color: string) => {
    const updated = lists.map((list) => (list.id === id ? { ...list, name, description, color } : list));
    updateLists(updated);
    setEditingList(null);
  };

  const handleDeleteList = (id: string) => {
    const updated = lists.filter((list) => list.id !== id);
    updateLists(updated);
    setOpenMenuId(null);
  };

  // -------------------- PROGRESS --------------------
  const getListProgress = (list: ShoppingList) => {
    if (list.items.length === 0) return 0;
    const checkedCount = list.items.filter((item) => item.checked).length;
    return (checkedCount / list.items.length) * 100;
  };

  // -------------------- UI --------------------
  const noLists = sortedLists.length === 0;

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
                onClick={(e) => { e.stopPropagation(); setSortMenuOpen(!sortMenuOpen); }}
              >
                Сортувати за <ChevronDown size={20} className={styles.sortIcon} />
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
              <button className={styles.addListBtn} onClick={() => setIsCreateModalOpen(true)}>
                Додати список <Plus size={20} />
              </button>
            </div>
          </div>
        )}

        {noLists ? (
          <div className={styles.emptyLists}>
            <img src={emptyList} alt="emptyList" className={styles.emptyImage} />
            <h2>У вас ще немає списків</h2>
            <p>Створіть свій перший список продуктів для зручних покупок.</p>
            <button className={styles.addListBtn} onClick={() => setIsCreateModalOpen(true)}>
              Додати список <Plus size={20} />
            </button>
          </div>
        ) : (
          <div className={styles.shoppingPageGrid}>
            <div className={styles.listsColumn}>
              {sortedLists.map((list) => {
                const createdDate = new Date(list.createdAt).toLocaleDateString('uk-UA', {
                  day: '2-digit', month: '2-digit', year: 'numeric',
                });
                return (
                  <div
                    key={list.id}
                    className={styles.collectionCard}
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest(`.${styles.cardMenu}`)) return;
                      navigate(`/shopping-list/${list.id}`, { state: {} });
                    }}
                  >
                    <div className={styles.cardHeader}>
                      <h3 data-testid={`list-title-${list.id}`} className={styles.cardTitle}>{list.name}</h3>
                      <div className={styles.cardMenu}>
                        <button
                         data-testid={`menu-button-${list.id}`}
                          className={styles.menuButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === list.id ? null : list.id);
                          }}
                        >
                          <MoreVertical size={20} />
                        </button>

                        {openMenuId === list.id && (
                          <div className={styles.menuDropdown} onClick={(e) => e.stopPropagation()}>
                            <div onClick={() => setEditingList(list)}>Редагувати</div>
                            <div onClick={() => handleDeleteList(list.id)}>Видалити</div>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className={styles.createdDate}>{createdDate}</p>

                    <div className={styles.progressLabel}>
                      <p className={styles.progressTitle}>Прогрес</p>
                      {list.items.filter((item) => item.checked).length} із {list.items.length} продуктів
                    </div>
                    <div className={styles.progressBarBackground}>
                      <div
                        className={styles.progressBarFill}
                        style={{ width: `${getListProgress(list)}%`, backgroundColor: list.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {isCreateModalOpen && (
          <CreateListModal onClose={() => setIsCreateModalOpen(false)} onCreate={handleCreateList} />
        )}

        {editingList && (
          <CreateListModal
            initialData={editingList}
            onClose={() => setEditingList(null)}
            onCreate={handleCreateList}
            onEdit={(updated) => handleUpdateList(updated.id, updated.name, updated.description || '', updated.color || '')}
          />
        )}
      </div>
    </main>
  );
};

export default ShoppingListPage;
