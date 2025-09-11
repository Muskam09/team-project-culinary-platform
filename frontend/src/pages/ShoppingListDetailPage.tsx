import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import styles from "./ShoppingListDetailPage.module.scss";
import { recipeDetails } from "../data/recipeDetails";
import type { Ingredient } from "../data/recipeDetails";
import { Plus, ChevronDown, MoreVertical, Check, X } from "lucide-react";
import iconCopy from "../assets/icon-park-outline_copy.svg";
import iconPrint from "../assets/icon-park-outline_printer-one.svg";
import iconSend from "../assets/icon-park-outline_export.svg";
import iconMarket from "../assets/icon-park-outline_transaction-order.svg";
import { FaSearch } from "react-icons/fa";

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
  "Овочі та зелень",
  "Фрукти",
  "М’ясо та риба",
  "Молочні продукти та яйця",
  "Бакалія, соуси, горіхи",
  "Жири/Олія",
  "Спеції",
  "Інше",
];

const ShoppingListDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [list, setList] = useState<ShoppingList | null>(null);

  const [showAddBlock, setShowAddBlock] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [customAmount, setCustomAmount] = useState<number | string>("");
  const [customUnit, setCustomUnit] = useState<string>("");

  const [sortByCategory, setSortByCategory] = useState(false);

  const addBlockRef = useRef<HTMLDivElement | null>(null);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ name: string; amount?: number | string; unit?: string }>({ name: "" });
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const lists: ShoppingList[] = JSON.parse(localStorage.getItem("shoppingLists") || "[]");
    const found = lists.find((l) => l.id === id) || null;
    setList(found);
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (addBlockRef.current && !addBlockRef.current.contains(e.target as Node)) {
        setShowAddBlock(false);
      }
    };
    if (showAddBlock) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAddBlock]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setEditingItemId(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const saveLists = (updatedList: ShoppingList) => {
    const allLists: ShoppingList[] = JSON.parse(localStorage.getItem("shoppingLists") || "[]");
    const updatedLists = allLists.map((l) => (l.id === updatedList.id ? updatedList : l));
    localStorage.setItem("shoppingLists", JSON.stringify(updatedLists));
    setList(updatedList);
  };

  const handleAddItem = () => {
    if (!list || !selectedIngredient) return;

    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: selectedIngredient.name,
      amount: customAmount !== "" ? customAmount : selectedIngredient.amount,
      unit: customUnit || selectedIngredient.unit,
      checked: false,
      category: selectedIngredient.category || "Інше",
    };

    const updatedList = { ...list, items: [...list.items, newItem] };
    saveLists(updatedList);

    setSelectedIngredient(null);
    setCustomAmount("");
    setCustomUnit("");
    setShowAddBlock(false);
  };

  const toggleChecked = (itemId: string) => {
    if (!list) return;
    const updatedItems = list.items.map((item) =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    saveLists({ ...list, items: updatedItems });
  };

  const startEditing = (item: ShoppingItem) => {
    setEditingItemId(item.id);
    setEditValues({ name: item.name, amount: item.amount, unit: item.unit });
    setOpenMenuId(null);
    setTimeout(() => nameInputRef.current?.focus(), 0);
  };

  const saveEdit = (itemId: string) => {
    if (!list) return;
    const updatedItems = list.items.map((item) =>
      item.id === itemId ? { ...item, ...editValues } : item
    );
    saveLists({ ...list, items: updatedItems });
    setEditingItemId(null);
  };

  const deleteItem = (itemId: string) => {
    if (!list) return;
    const updatedItems = list.items.filter((item) => item.id !== itemId);
    saveLists({ ...list, items: updatedItems });
    setOpenMenuId(null);
  };

  if (!list) return <p>Список не знайдено</p>;

  const allIngredients: Ingredient[] = recipeDetails.flatMap((r) => r.ingredients);
  const availableIngredients = allIngredients.filter(
    (ing) => !list.items.some((item) => item.name === ing.name)
  );

  const ingredientCategoryMap = new Map<string, string>();
  allIngredients.forEach((ing) => {
    if (ing.category) ingredientCategoryMap.set(ing.name, ing.category);
  });

  const groupedItems = list.items.reduce<Record<string, ShoppingItem[]>>((acc, item) => {
    const category = ingredientCategoryMap.get(item.name) || "Інше";
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  const categoriesToRender = sortByCategory
    ? [...categoryOrder.filter((c) => groupedItems[c]), ...Object.keys(groupedItems).filter((c) => !categoryOrder.includes(c))]
    : [""]; // обычный список без категории

  return (
    <main className={styles.main}>
      <Header
        showSearch={false}
        customSearch={
          <div className={styles.customSearchWrapper}>
            <FaSearch className={styles.searchIcon} />
            <input type="text" className={styles.customSearch} placeholder="Пошук…" />
          </div>
        }
        showBackButton
        backButtonLabel="До списку рецептів"
        onBackClick={() => navigate(-1)}
      />
      <div className={styles.titleBlock}>
        <h1 className={styles.title}>{list.name}</h1>
        <div className={styles.createdAtBlock}>
          <p className={styles.createdAt}>
            Створено:{" "}
            {new Date(list.createdAt).toLocaleDateString("uk-UA", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </p>
          <p className={styles.itemCount}> • {list.items.length} елементів</p>
        </div>
      </div>

      <div className={styles.productsBlock}>
        <div className={styles.productsButtons}>
          <button className={styles.sortButton} onClick={() => setSortByCategory((prev) => !prev)}>
            {sortByCategory ? "Звичайний список" : "За категорією"} <ChevronDown size={20} />
          </button>
          <button className={styles.showAddButton} onClick={() => setShowAddBlock(!showAddBlock)}>
            Додати інгредієнт <Plus size={20} />
          </button>
        </div>

        {showAddBlock && (
          <div className={styles.addItemBlock} ref={addBlockRef}>
            <div className={styles.selectInputWrapper}>
              <select
                className={styles.selectInput}
                value={selectedIngredient?.name || ""}
                onChange={(e) => {
                  const ingredient = availableIngredients.find((i) => i.name === e.target.value) || null;
                  setSelectedIngredient(ingredient);
                  setCustomAmount(ingredient?.amount || "");
                  setCustomUnit(ingredient?.unit || "");
                }}
              >
                <option value="">Виберіть продукт</option>
                {availableIngredients.map((ing, idx) => (
                  <option key={idx} value={ing.name}>
                    {ing.name} {ing.amount ? `- ${ing.amount} ${ing.unit || ""}` : ""}
                  </option>
                ))}
              </select>
            </div>

            {selectedIngredient && (
              <>
                <input
                  type="number"
                  placeholder="Кількість"
                  value={customAmount}
                  onChange={(e) =>
                    setCustomAmount(e.target.value === "" ? "" : Number(e.target.value))
                  }
                />
                <input
                  type="text"
                  placeholder="Одиниця"
                  value={customUnit}
                  onChange={(e) => setCustomUnit(e.target.value)}
                />
              </>
            )}

            <button onClick={handleAddItem}>Додати продукт</button>
          </div>
        )}

        {categoriesToRender.map((category) => {
          const items = category ? groupedItems[category] : list.items;
          if (!items || items.length === 0) return null;

          return (
            <div key={category || "all"} className={styles.categoryBlock}>
              {sortByCategory && <h3 className={styles.categoryTitle}>{category}</h3>}
              <ul className={styles.itemList}>
                {items.map((item) => (
                  <li key={item.id} className={styles.item}>
                    {editingItemId === item.id ? (
                      <div className={styles.editBlock}>
                        <input
                          ref={nameInputRef}
                          type="text"
                          value={editValues.name}
                          onChange={(e) => setEditValues((v) => ({ ...v, name: e.target.value }))}
                        />
                        <input
                          type="number"
                          value={editValues.amount || ""}
                          onChange={(e) =>
                            setEditValues((v) => ({
                              ...v,
                              amount: e.target.value === "" ? "" : Number(e.target.value),
                            }))
                          }
                        />
                        <input
                          type="text"
                          value={editValues.unit || ""}
                          onChange={(e) => setEditValues((v) => ({ ...v, unit: e.target.value }))}
                        />
                        <div className={styles.editButtons}>
                          <button className={styles.saveButton} onClick={() => saveEdit(item.id)}>
                            <Check size={16} />
                          </button>
                          <button className={styles.deleteButton} onClick={() => setEditingItemId(null)}>
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className={styles.itemNameBlock}>
                          <label className={styles.checkboxWrapper}>
                            <input
                              type="checkbox"
                              checked={item.checked || false}
                              onChange={() => toggleChecked(item.id)}
                            />
                            <span className={styles.customCheck}></span>
                          </label>
                          <span className={item.checked ? styles.checkedItem : styles.itemName}>{item.name}</span>
                        </div>
                        <div className={styles.itemAmountBlock}>
                        {item.amount && (
                          <span className={styles.itemAmount}>
                            {item.amount} {item.unit || ""}
                          </span>
                        )}
                        <div className={styles.itemMenu}>
                          <button onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}>
                            <MoreVertical size={20} />
                          </button>
                          {openMenuId === item.id && (
                            <div className={styles.menuDropdown}>
                              <button onClick={() => startEditing(item)}>Редагувати</button>
                              <button onClick={() => deleteItem(item.id)}>Видалити</button>
                            </div>
                          )}
                        </div>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className={styles.footerButtons}>
        <div className={styles.footerButtonsBlock}>
          <button className={styles.copyButton}>
            Копіювати <img src={iconCopy} alt="copy" />
          </button>
          <button className={styles.printButton}>
            Друкувати <img src={iconPrint} alt="prin" />
          </button>
          <button className={styles.sendButton}>
            Поділитись <img src={iconSend} alt="send" />
          </button>
        </div>
        <button className={styles.marketButton}>
          <img src={iconMarket} alt="market" />
          Замовити в Сільпо
        </button>
      </div>
    </main>
  );
};

export default ShoppingListDetailPage;
