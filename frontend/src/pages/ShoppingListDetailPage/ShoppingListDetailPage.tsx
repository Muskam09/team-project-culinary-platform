// ShoppingListDetailPage.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, ChevronDown, ChevronLeft } from 'lucide-react';
import Header from '../../components/Header/Header';
import AddIngredientModal from '../../components/AddIngredientModal/AddIngredientModal';
import styles from './ShoppingListDetailPage.module.scss';
import { recipeDetails } from '../../data/recipeDetails';
import emptyList from '../../assets/EmptyLists.png';
import iconEdit from '../../assets/icon-park-outline_edit.svg';

interface ShoppingItem {
  id: string;
  name: string;
  amount?: number | string;
  unit?: string;
  checked?: boolean;
  category?: string;
}

interface ShoppingList {
  id: string;
  name: string;
  createdAt: string;
  items: ShoppingItem[];
}

const categoryOrder = [
  'Овочі та зелень',
  'Фрукти',
  'М’ясо та риба',
  'Молочні продукти та яйця',
  'Бакалія, соуси, горіхи',
  'Жири/Олія',
  'Спеції',
  'Інше',
];

const unitsList = ['г', 'кг', 'мл', 'л', 'шт'];

const ShoppingListDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [list, setList] = useState<ShoppingList | null>(null);
  const [sortByCategory, setSortByCategory] = useState(false);
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  // Закрытие меню при клике вне
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Загрузка списка из localStorage
  useEffect(() => {
    const lists: ShoppingList[] = JSON.parse(localStorage.getItem('shoppingLists') || '[]');
    const found = lists.find((l) => l.id === id) || null;
    setList(found);
  }, [id]);

  const saveLists = (updatedList: ShoppingList) => {
    const allLists: ShoppingList[] = JSON.parse(localStorage.getItem('shoppingLists') || '[]');
    const updatedLists = allLists.map((l) => (l.id === updatedList.id ? updatedList : l));
    localStorage.setItem('shoppingLists', JSON.stringify(updatedLists));
    setList(updatedList);
  };

  const toggleChecked = (itemId: string) => {
    if (!list) return;
    const updatedItems = list.items.map((item) => (item.id === itemId ? { ...item, checked: !item.checked } : item));
    saveLists({ ...list, items: updatedItems });
  };

  if (!list) return <p>Список не знайдено</p>;

  // Мапа категорий ингредиентов
  const ingredientCategoryMap = new Map<string, string>();
  recipeDetails.flatMap((r) => r.ingredients).forEach((ing) => {
    if (ing.category) ingredientCategoryMap.set(ing.name, ing.category);
  });

  // Группировка элементов по категории
  const groupedItems = list.items.reduce<Record<string, ShoppingItem[]>>((acc, item) => {
    const category = ingredientCategoryMap.get(item.name) || 'Інше';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  const categoriesToRender = sortByCategory
    ? [
      ...categoryOrder.filter((c) => groupedItems[c]),
      ...Object.keys(groupedItems).filter((c) => !categoryOrder.includes(c)),
    ]
    : [''];

  const isEmpty = list.items.length === 0;

  return (
    <main className={styles.main}>
      <Header />
      <div className={styles.mainBlock}>
        <button className={styles.backButton} onClick={() => navigate('/shopping-list')}>
          <ChevronLeft />
          {' '}
          До списків
        </button>

        <div className={styles.titleBlock}>
          <div className={styles.nameBlock}>
            <h1 className={styles.title}>{list.name}</h1>

            <div className={styles.menuWrapper}>
              <button
                className={styles.menuButton}
                onClick={() => setShowMenu((prev) => !prev)}
              >
                <img src={iconEdit} alt="edit" />
              </button>

              {showMenu && (
                <div className={styles.menuPopup} ref={menuRef}>
                  <button
                    onClick={() => {
                      if (window.confirm('Видалити всі продукти зі списку?')) {
                        saveLists({ ...list, items: [] });
                      }
                      setShowMenu(false);
                    }}
                  >
                    Видалити всі продукти
                  </button>
                  <button
                    disabled={!selectedItemId}
                    onClick={() => {
                      if (!selectedItemId) return;
                      const updatedItems = list.items.filter((i) => i.id !== selectedItemId);
                      saveLists({ ...list, items: updatedItems });
                      setSelectedItemId(null);
                      setShowMenu(false);
                    }}
                  >
                    Видалити інгредієнт
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className={styles.createdAtBlock}>
            <p className={styles.createdAt}>
              Створено:
              {' '}
              {new Date(list.createdAt).toLocaleDateString('uk-UA', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </p>
            <p className={styles.itemCount}>
              {' '}
              •
              {list.items.length}
              {' '}
              елементів
            </p>
          </div>
        </div>

        {isEmpty ? (
          <div className={styles.emptyListBlock}>
            <img src={emptyList} alt="empty list" className={styles.emptyImage} />
            <h2 className={styles.emptyTitle}>Список продуктів порожній</h2>
            <p className={styles.emptyText}>
              Додайте потрібні інгредієнти, щоб завжди
              {' '}
              <br />
              мати під рукою все для улюблених страв.
            </p>
            <button
              className={styles.showAddButton}
              onClick={() => setShowAddBlock(true)}
            >
              Додати інгредієнти
              {' '}
              <Plus size={20} />
            </button>
          </div>
        ) : (
          <div className={styles.productsBlock}>
            <div className={styles.productsButtons}>
              <button
                className={styles.sortButton}
                onClick={() => setSortByCategory((prev) => !prev)}
              >
                Сортувати за
                {' '}
                <ChevronDown size={20} />
              </button>
              <button
                className={styles.showAddButton}
                onClick={() => setShowAddBlock(true)}
              >
                Додати інгредієнт
                {' '}
                <Plus size={20} />
              </button>
            </div>

            {categoriesToRender.map((category) => {
              const items = category ? groupedItems[category] : list.items;
              if (!items || items.length === 0) return null;

              return (
                <div key={category || 'all'} className={styles.categoryBlock}>
                  {sortByCategory && <h3 className={styles.categoryTitle}>{category}</h3>}
                  <ul className={styles.itemList}>
                    {items.map((item) => (
                      <li
                        key={item.id}
                        className={`${styles.item} ${
                          selectedItemId === item.id ? styles.selectedItem : ''
                        }`}
                        onClick={() => setSelectedItemId(item.id)}
                      >
                        <div className={styles.itemNameBlock}>
                          <input
                            type="checkbox"
                            checked={item.checked || false}
                            onChange={() => toggleChecked(item.id)}
                            className={styles.checkbox}
                            aria-label={item.name} // для тестов
                          />
                          <span className={item.checked ? styles.checkedItem : styles.itemName}>
                            {item.name}
                          </span>
                        </div>
                        <div className={styles.itemAmountBlock}>
                          {item.amount && (
                            <span className={styles.itemAmount}>
                              {item.amount}
                              {' '}
                              {item.unit || ''}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}

        {showAddBlock && (
          <AddIngredientModal
            categories={categoryOrder}
            units={unitsList}
            existingIngredients={recipeDetails.flatMap((r) => r.ingredients)}
            onClose={() => setShowAddBlock(false)}
            onAdd={(data) => {
              if (!list) return;
              const newItem: ShoppingItem = {
                id: Date.now().toString(),
                name: data.name,
                category: data.category,
                amount: data.amount,
                unit: data.unit,
                checked: false,
              };
              saveLists({ ...list, items: [...list.items, newItem] });
              setShowAddBlock(false);
            }}
          />
        )}
      </div>
    </main>
  );
};

export default ShoppingListDetailPage;
