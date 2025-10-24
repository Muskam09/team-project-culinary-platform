// src/components/FilterModal.tsx
import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import styles from './FilterModal.module.scss';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: {
    cuisines?: string[];
    category?: string;
    time?: string;
    complexity?: string;
    diet?: string;
  }) => void;
}

const availableCuisines = [
  'Японська', 'Італійська', 'Грецька', 'Французька', 'Європейська', 'Скандинавська', 'Корейська', 'Китайська', 'Британська',
  'Американська', 'Мексиканська', 'Індійська', 'Сучасна', 'Близькосхідна', 'Середземноморська', 'Азійська', 'Гавайська',
  'Шведська', 'Карибська',
];

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApply }) => {
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [time, setTime] = useState('');
  const [complexity, setComplexity] = useState('');
  const [diet, setDiet] = useState('');

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Закрытие dropdown при клике вне
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleCuisine = (cuisine: string) => {
    if (cuisines.includes(cuisine)) {
      setCuisines(cuisines.filter((c) => c !== cuisine));
    } else {
      setCuisines([...cuisines, cuisine]);
    }
  };

  const toggleAll = () => {
    if (cuisines.length === availableCuisines.length) {
      setCuisines([]);
    } else {
      setCuisines([...availableCuisines]);
    }
  };

  const resetFilters = () => {
    setCuisines([]);
    setCategory('');
    setTime('');
    setComplexity('');
    setDiet('');
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose} data-testid="filter-modal" role="dialog">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.headerTitle}>Фільтр</h2>
          <button className={styles.headerButton} onClick={onClose}><X size={20} /></button>
        </div>

        <div className={styles.content}>
          {/* Кухня с dropdown */}
          <div className={styles.cuisineFilter} ref={dropdownRef}>
            <label>Кухня</label>
            {/* Теги выбранных кухонь */}
            {cuisines.length > 0 && (
              <div className={styles.cuisineTags}>
                {cuisines.map((c) => (
                  <span key={c} className={styles.cuisineTag}>
                    {c}
                  </span>
                ))}
              </div>
            )}
            <div className={styles.inputWrapper} onClick={() => setDropdownOpen(!dropdownOpen)}>
              <input
                readOnly
                value=""
                placeholder="Оберіть кухню"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
              <ChevronDown size={20} className={styles.chevronIcon} />
            </div>
            {dropdownOpen && (
              <div className={styles.cuisineDropdown}>
                <div className={styles.cuisineOptions}>
                  <label>
                    <input
                      type="checkbox"
                      checked={cuisines.length === availableCuisines.length}
                      onChange={toggleAll}
                    />
                    Всі
                  </label>
                  {availableCuisines.map((c) => (
                    <label key={c}>
                      <input
                        type="checkbox"
                        checked={cuisines.includes(c)}
                        onChange={() => toggleCuisine(c)}
                      />
                      {c}
                    </label>
                  ))}
                </div>

                <div className={styles.dropdownActions}>
                  <button onClick={resetFilters}>Скинути</button>
                  <button onClick={() => setDropdownOpen(false)}>Застосувати</button>
                </div>
              </div>
            )}
          </div>

          {/* Остальные фильтры */}
          <label>Категорія страви</label>
          <div className={styles.categoryButtons}>
            {['Сніданок', 'Обід', 'Вечеря', 'Перекус', 'Десерт', 'Напій'].map((cat) => (
              <button
                key={cat}
                type="button"
                className={`${styles.categoryButton} ${category === cat ? styles.active : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Час приготування */}
          <label>Час приготування</label>
          <div className={styles.timeButtons}>
            {['< 15 хв', '< 30 хв', '< 1 години', '> 1 години'].map((t) => (
              <button
                key={t}
                type="button"
                className={`${styles.timeButton} ${time === t ? styles.active : ''}`}
                onClick={() => setTime(t)}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Складність */}
          {/* Складність */}
          <label>Складність</label>
          <div className={styles.difficultyButtons}>
            {['Легко', 'Помірно', 'Складно'].map((d) => (
              <button
                key={d}
                type="button"
                className={`${styles.difficultyButton} ${complexity === d ? styles.active : ''}`}
                onClick={() => setComplexity(d)}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Дієтичні уподобання */}
          <label>Дієтичні уподобання</label>
          <div className={styles.dietButtons}>
            {['Вегетаріанське', 'Веганське', 'Безглютенове', 'Безлактозне', 'Низькокалорійне', 'Низьковуглеводне', 'Кето'].map((d) => (
              <button
                key={d}
                type="button"
                className={`${styles.dietButton} ${diet === d ? styles.active : ''}`}
                onClick={() => setDiet(d)}
              >
                {d}
              </button>
            ))}
          </div>

        </div>

        <div className={styles.actions}>
          <button className={styles.resetButton} onClick={resetFilters}>Очистити фільтр</button>
          <button
            data-testid="apply-button"
            className={`${styles.applyButton} ${!cuisines.length && !category && !time && !complexity && !diet ? styles.disabled : ''}`}
            disabled={!cuisines.length && !category && !time && !complexity && !diet}
            onClick={() => onApply({
              cuisines, category, time, complexity, diet,
            })}
          >
            Застосувати
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
