import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import styles from './AddIngredientModal.module.scss';
import type { Ingredient } from '../../data/recipeDetails';

interface AddIngredientModalProps {
  initialName?: string;
  initialCategory?: string;
  initialAmount?: number | string;
  initialUnit?: string;
  categories: string[];
  units: string[];
  existingIngredients: Ingredient[];
  onClose: () => void;
  onAdd: (data: {
    name: string;
    category: string;
    amount?: number | string;
    unit?: string;
  }) => void;
}

const AddIngredientModal: React.FC<AddIngredientModalProps> = ({
  initialName = '',
  initialCategory,
  initialAmount = '',
  initialUnit = '',
  categories,
  units,
  existingIngredients,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState(initialName);
  const [amount, setAmount] = useState<number | string>(initialAmount);
  const [unit, setUnit] = useState(initialUnit);
  const [category, setCategory] = useState(initialCategory || '');
  const [showList, setShowList] = useState(false);
  const [showCategoryOptions, setShowCategoryOptions] = useState(false);
  const [showUnitOptions, setShowUnitOptions] = useState(false);

  const modalRef = useRef<HTMLDivElement | null>(null);
  const autocompleteRef = useRef<HTMLDivElement | null>(null);
  const categoryRef = useRef<HTMLDivElement | null>(null);
  const unitRef = useRef<HTMLDivElement | null>(null);

  const filteredIngredients = existingIngredients.filter((ing) => ing.name.toLowerCase().includes(name.toLowerCase()));

  // Закрытие модалки при клике вне
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Закрытие автокомплита при клике вне
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(e.target as Node)) {
        setShowList(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Закрытие категории при клике вне
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setShowCategoryOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Закрытие единицы при клике вне
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (unitRef.current && !unitRef.current.contains(e.target as Node)) {
        setShowUnitOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAdd = () => {
    if (!name || !category || !unit) return;
    onAdd({
      name, category, amount, unit,
    });
    setName('');
    setAmount('');
    setUnit('');
    setCategory('');
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.addModal} ref={modalRef}>
        <div className={styles.modalHeader}>
          <h2>Додати інгредієнт</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <label>Назва інгредієнта</label>
          <div className={styles.autocompleteWrapper} ref={autocompleteRef}>
            <input
              type="text"
              placeholder="Наприклад: «Сир твердий»"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setShowList(true)}
            />
            {showList && filteredIngredients.length > 0 && (
              <ul className={styles.autocompleteList}>
                {filteredIngredients.map((ing) => (
                  <li
                    key={ing.name}
                    className={name === ing.name ? styles.activeOption : ''}
                    onClick={() => {
                      setName(ing.name);
                      setShowList(false);
                    }}
                  >
                    {ing.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <label>Категорія</label>
          <div className={styles.customSelectWrapper} ref={categoryRef}>
            <div
              className={`${styles.customSelect} ${category ? styles.selectedText : styles.placeholderText}`}
              onClick={() => setShowCategoryOptions(!showCategoryOptions)}
            >
              {category || 'Оберіть категорію інгредієнта'}
            </div>
            {showCategoryOptions && (
              <ul className={styles.customOptions}>
                {categories.map((cat) => (
                  <li
                    key={cat}
                    className={category === cat ? styles.activeOption : ''}
                    onClick={() => {
                      setCategory(cat);
                      setShowCategoryOptions(false);
                    }}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <label>Кількість</label>
          <div className={styles.amountUnitRow}>
            <input
              type="number"
              placeholder="Укажіть кількість"
              value={amount}
              onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
            />

            <div className={styles.customSelectWrapper} ref={unitRef}>
              <div
                className={`${styles.customSelect} ${unit ? styles.selectedText : styles.placeholderText}`}
                onClick={() => setShowUnitOptions(!showUnitOptions)}
              >
                {unit || 'Одиниця виміру'}
              </div>
              {showUnitOptions && (
                <ul className={styles.customOptions}>
                  {units.map((u) => (
                    <li
                      key={u}
                      className={unit === u ? styles.activeOption : ''}
                      onClick={() => {
                        setUnit(u);
                        setShowUnitOptions(false);
                      }}
                    >
                      {u}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelButton} onClick={onClose}>
            Скасувати
          </button>
          <button
            className={styles.addButton}
            onClick={handleAdd}
            disabled={!name || !category || !unit}
          >
            Додати інгредієнт
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddIngredientModal;
